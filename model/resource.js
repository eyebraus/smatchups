
module.exports = (function () {

    var q = require('q')
      , _ = require('underscore')._
      , util = require('util')
      , vargs = require('vargs').Constructor
      , winston = require('winston');

    var log = new (winston.Logger)({
        transports: [new (winston.transports.Console)()]
    });

    /**
     * "Private" methods
     */

    var expandProperty = function (template, parameters) {
        return util.format.apply({}, [template].concat(parameters));
    };

    var validateProperties = function (properties, fn) {
        var valid = true;

        _.each(properties, function (property) {
            valid = valid && fn(property);

            if (!valid) {
                return;
            }
        });

        return valid;
    };

    /**
     * Resource
     * @description Constructor for Resource
     * @param {object} redisClient Client for interfacing with a redis keystore
     * @param {object} path Base path and path to keyset of resource in keystore
     */

    var Resource = function (redisClient, path) {
        this.redisClient = redisClient;
        this.path = path;
    };

    /**
     * Resource.all
     * @description Query all instances of resource in repository
     * @param {arguments} parameters Optional list of ids needed to resolve resource
     * @return {promise} Promise for all instances of this resource, or rejection if resource or request is invalid.
     */

    Resource.prototype.all = function (/* [parameters] */) {
        var that = this
          , args = new (vargs)(arguments)
          , expandedProperty = expandProperty(this.path, args.all);

        return this.isValid()
            .then(function () {
                return that.isRequestValid(that.path, args.all)
            })
            .then(function () {
                return that.redisClient.smembers(expandedProperty);
            })
            .then(function (modelIds) {
                var promises = [];

                _.each(modelIds, function (modelId) {
                    var parameters = args.all.concat([modelId]);
                    promises.push(that.get.apply(that, parameters));
                });

                return q.all(promises);
            });
    };

    /**
     * Resource.create
     * @description Create a new instance of resource in repository
     * @param {arguments} parameters Optional list of ids needed to resolve resource
     * @param {object} document New document to create in repository
     * @return {promise} Promise returning copy of model w/ id & rev, or rejection if resource or request is invalid.
     */

    Resource.prototype.create = function (/* [parameters], document */) {
        var that = this
          , args = new (vargs)(arguments)
          , parameters = args.all.slice(0, -1)
          , document = args.last
          , expandedPath = expandProperty(this.path, parameters)
          , currentTimestamp = new Date().toString();

        return this.isValid()
            .then(function () {
                return that.isRequestValid(expandedPath, parameters);
            })
            .then(function () {
                // create an identifier for the new resource
                return that.generateID(expandedPath);
            })
            .then(function (id) {
                var createParameters = parameters.concat([id])
                  , expandedIdPath = expandProperty(that.path + ':%s/id', createParameters)
                  , expandedRevPath = expandProperty(that.path + ':%s/rev', createParameters)
                  , expandedCreatedAtPath = expandProperty(that.path + ':%s/createdAt', createParameters)
                  , expandedUpdatedAtPath = expandProperty(that.path + ':%s/updatedAt', createParameters)
                  , expandedDocPath = expandProperty(that.path + ':%s/doc', createParameters);

                return that.idExists(expandedPath, id)
                    .then(function (idExists) {
                        if (idExists) {
                            return q.reject({
                                type: 'idAlreadyExists',
                                message: util.format('ID "%s" already exists for path %s', id, expandedPath)
                            });
                        }

                        that.redisClient.watch(expandedIdPath);
                        that.redisClient.multi();

                        that.redisClient.sadd(expandedPath, id);
                        that.redisClient.set(expandedIdPath, id);
                        that.redisClient.incr(expandedRevPath);
                        that.redisClient.set(expandedCreatedAtPath, currentTimestamp);
                        that.redisClient.set(expandedUpdatedAtPath, currentTimestamp);
                        that.redisClient.set(expandedDocPath, JSON.stringify(document));

                        return that.redisClient.exec();
                    })
                    .then(function (results) {
                        var addResult = results[0]
                          , idResult = results[1]
                          , revResult = results[2]
                          , createdAtResult = results[3]
                          , updatedAtResult = results[4]
                          , docResult = results[5]
                          , isValid = true;

                        // Since redis won't fail an entire transaction due to one failed command,
                        // log any abnormal results from exec. If any are noted, write that the object
                        // is invalid back to the keystore.
                        _.each([['id', idResult],
                                ['createdAt', createdAtResult],
                                ['updatedAt', updatedAtResult],
                                ['doc', docResult]],
                            function (tuple) {
                                var keyName = tuple[0]
                                  , result = tuple[1];

                                if (result !== 'OK') {
                                    log.warn('Property "%s" was not correctly set for resource %s, id %s', keyName, that.path, id);
                                    isValid = false;
                                }
                            });

                        if (addResult <= 0) {
                            log.warn('id %s was not correctly added to id set for resource %s', id, that.path);
                            isValid = false;
                        }

                        if (revResult <= 0) {
                            log.warn('rev was not correctly incremented for resource %s, id %s', that.path, id);
                            isValid = false;
                        }

                        var data = {
                                id: id,
                                rev: revResult,
                                createdAt: currentTimestamp,
                                updatedAt: currentTimestamp,
                                document: document,
                                valid: isValid
                            }
                          , expandedValidPath = expandProperty(that.path + ':%s/valid', createParameters);

                        return that.redisClient.set(expandedValidPath, isValid ? 1 : 0)
                            .then(function () {
                                if (isValid) {
                                    return q.fcall(function () {
                                        return data;
                                    });
                                } else {
                                    return q.reject({
                                        type: 'instanceNotValid',
                                        message: util.format('Create transaction for resource %s, instance %s partially failed', that.path, id),
                                        data: data
                                    });
                                }
                            });
                    });
            });
    };

    /**
     * Resource.get
     * @description Query instance of resource with given id(s)
     * @param {arguments} parameters Optional list of ids needed to resolve resource 
     * @return {promise} Promise for instance of resource with given id(s), or rejection if resource or request is invalid.
     */

    Resource.prototype.get = function (/* [parameters], id */) {
        var that = this
          , args = new (vargs)(arguments)
          , id = args.at(-1)
          , idPath = this.path + ':%s/id'
          , revPath = this.path + ':%s/rev'
          , createdAtPath = this.path + ':%s/createdAt'
          , updatedAtPath = this.path + ':%s/updatedAt'
          , docPath = this.path + ':%s/doc'
          , validPath = this.path + ':%s/valid'
          , expandedPath = expandProperty(this.path, args.all.slice(0, -1))
          , expandedIdPath = expandProperty(idPath, args.all)
          , expandedRevPath = expandProperty(revPath, args.all)
          , expandedCreatedAtPath = expandProperty(createdAtPath, args.all)
          , expandedUpdatedAtPath = expandProperty(updatedAtPath, args.all)
          , expandedDocPath = expandProperty(docPath, args.all)
          , expandedValidPath = expandProperty(validPath, args.all);

        return this.isValid()
            .then(function () {
                return that.isRequestValid(idPath, args.all);
            })
            .then(function () {
                return that.idExists(expandedPath, id);
            })
            .then(function (idExists) {
                if (!idExists) {
                    return q.reject({
                        type: 'idDoesNotExist',
                        message: util.format('ID "%s" does not exist for path %s', id, expandedPath)
                    });
                }

                return that.redisClient.get(expandedValidPath);
            })
            .then(function (valid) {
                if (valid <= 0) {
                    return q.reject({
                        type: 'instanceNotValid',
                        message: util.format('Requested id "%s" is not marked as valid', id)
                    });
                }

                return q.all([
                        that.redisClient.get(expandedIdPath),
                        that.redisClient.get(expandedRevPath),
                        that.redisClient.get(expandedCreatedAtPath),
                        that.redisClient.get(expandedUpdatedAtPath),
                        that.redisClient.get(expandedDocPath)])
                    .then(function (results) {
                        return q.fcall(function () {
                            return {
                                id: results[0],
                                rev: results[1],
                                createdAt: results[2],
                                updatedAt: results[3],
                                document: JSON.parse(results[4]),
                                valid: valid > 0
                            };
                        });
                    });
            });
    };

    /**
     * Resource.edit
     * @description Edit instance of existing resource in repository
     * @param {arguments} parameters Optional list of ids needed to resolve resource
     * @param {string} id Resource ID in repository
     * @param {string} rev Resource revision in repository
     * @param {string} document New content to write to resource
     * @return {promise} Promise returning copy of resource w/ id & rev, or rejection if request is invalid.
     */

    Resource.prototype.edit = function (/* [parameters], id, rev, document */) {
        var that = this
          , args = new (vargs)(arguments)
          , pathParameters = args.all.slice(0, -2)
          , id = args.at(-3)
          , rev = args.at(-2)
          , document = args.at(-1)
          , idPath = this.path + ':%s/id'
          , revPath = this.path + ':%s/rev'
          , createdAtPath = this.path + ':%s/createdAt'
          , updatedAtPath = this.path + ':%s/updatedAt'
          , docPath = this.path + ':%s/doc'
          , validPath = this.path + ':%s/valid'
          , expandedPath = expandProperty(this.path, args.all.slice(0, -3))
          , expandedIdPath = expandProperty(idPath, pathParameters)
          , expandedRevPath = expandProperty(revPath, pathParameters)
          , expandedCreatedAtPath = expandProperty(createdAtPath, pathParameters)
          , expandedUpdatedAtPath = expandProperty(updatedAtPath, pathParameters)
          , expandedDocPath = expandProperty(docPath, pathParameters)
          , expandedValidPath = expandProperty(validPath, pathParameters)
          , currentTimestamp = new Date().toString();

        return this.isValid()
            .then(function () {
                return that.isRequestValid(idPath, pathParameters);
            })
            .then(function () {
                return that.idExists(expandedPath, id);
            })
            .then(function (idExists) {
                if (!idExists) {
                    return q.reject({
                        type: 'idDoesNotExist',
                        message: util.format('ID "%s" does not exist for path %s', id, expandedPath)
                    });
                }

                return that.redisClient.get(expandedValidPath);
            })
            .then(function (valid) {
                if (valid <= 0) {
                    return q.reject({
                        type: 'instanceNotValid',
                        message: util.format('Requested id "%s" is not marked as valid', id)
                    });
                }

                that.redisClient.watch(expandedRevPath);

                return that.redisClient.get(expandedRevPath);
            })
            .then(function (serverRev) {
                if (rev !== serverRev) {
                    that.redisClient.unwatch(expandedRevPath);

                    return q.reject({
                        type: 'revIsOutOfDate',
                        message: 'Client revision did not match server before transaction'
                    });
                }

                that.redisClient.multi();
                that.redisClient.incr(expandedRevPath);
                that.redisClient.get(expandedCreatedAtPath);
                that.redisClient.set(expandedUpdatedAtPath, currentTimestamp);
                that.redisClient.set(expandedDocPath, JSON.stringify(document));

                return that.redisClient.exec();
            })
            .then(function (results) {
                var newRev = results[0]
                  , createdAt = results[1]
                  , updatedAtResult = results[2]
                  , docResult = results[3]
                  , isValid = true;

                // Since redis won't fail an entire transaction due to one failed command,
                // log any abnormal results from exec. If any are noted, write that the object
                // is invalid back to the keystore.
                _.each([['updatedAt', updatedAtResult],
                        ['doc', docResult]],
                    function (tuple) {
                        var keyName = tuple[0]
                          , result = tuple[1];

                        if (result !== 'OK') {
                            log.warn('Property "%s" was not correctly set for resource %s, id %s', keyName, that.path, id);
                            isValid = false;
                        }
                    });

                var data = {
                    id: id,
                    rev: newRev,
                    createdAt: createdAt,
                    updatedAt: currentTimestamp,
                    document: document,
                    valid: isValid
                };

                return that.redisClient.set(expandedValidPath, isValid ? 1 : 0)
                    .then(function () {
                        if (isValid) {
                            return q.fcall(function () {
                                return data;
                            });
                        } else {
                            return q.reject({
                                type: 'instanceNotValid',
                                message: util.format('Edit transaction for resource %s, instance %s partially failed', that.path, id),
                                data: data
                            });
                        }
                    });
            });
    };

    /**
     * Resource.delete
     * @description Delete instance of resource in repository
     * @param {arguments} parameters Optional list of ids needed to resolve resource
     * @param {string} id Resource ID in repository
     * @param {string} rev Resource revision in repository
     * @return {promise} Promise returning true, or rejection if request is invalid.
     */

    Resource.prototype.delete = function (/* [parameters], id, rev */) {
        var that = this
          , args = new (vargs)(arguments)
          , pathParameters = args.all.slice(0, -1)
          , id = args.at(-2)
          , rev = args.at(-1)
          , idPath = this.path + ':%s/id'
          , revPath = this.path + ':%s/rev'
          , createdAtPath = this.path + ':%s/createdAt'
          , updatedAtPath = this.path + ':%s/updatedAt'
          , docPath = this.path + ':%s/doc'
          , validPath = this.path + ':%s/valid'
          , expandedPath = expandProperty(this.path, args.all.slice(0, -2))
          , expandedIdPath = expandProperty(idPath, pathParameters)
          , expandedRevPath = expandProperty(revPath, pathParameters)
          , expandedCreatedAtPath = expandProperty(createdAtPath, pathParameters)
          , expandedUpdatedAtPath = expandProperty(updatedAtPath, pathParameters)
          , expandedDocPath = expandProperty(docPath, pathParameters)
          , expandedValidPath = expandProperty(validPath, pathParameters);

        return this.isValid()
            .then(function () {
                return that.isRequestValid(idPath, pathParameters);
            })
            .then(function () {
                return that.idExists(expandedPath, id);
            })
            .then(function (idExists) {
                if (!idExists) {
                    return q.reject({
                        type: 'idDoesNotExist',
                        message: util.format('ID "%s" does not exist for path %s', id, expandedPath)
                    });
                }

                that.redisClient.watch(expandedRevPath);

                return that.redisClient.get(expandedRevPath);
            })
            .then(function (serverRev) {
                if (rev !== serverRev) {
                    that.redisClient.unwatch(expandedRevPath);

                    return q.reject({
                        type: 'revIsOutOfDate',
                        message: 'Client revision did not match server before transaction'
                    });
                }

                that.redisClient.multi();
                that.redisClient.del(expandedIdPath);
                that.redisClient.del(expandedRevPath);
                that.redisClient.del(expandedCreatedAtPath);
                that.redisClient.del(expandedUpdatedAtPath);
                that.redisClient.del(expandedDocPath);
                that.redisClient.del(expandedValidPath);
                that.redisClient.srem(expandedPath, id);

                return that.redisClient.exec();
            })
            .then(function (results) {
                return q.fcall(function () {
                    return true;
                });
            });
    };

    /**
     * Resource.isValid
     * @description Determine whether client-side resource is valid
     * @return {promise} Promise returning true, or rejection if resource is invalid
     */

    Resource.prototype.isValid = function () {
        // reject if any of the constructor arguments were falsy
        if (!this.redisClient) {
            return q.reject({
                type: 'noRedisClient',
                message: 'Client for redis requests is null or falsy'
            });
        }

        if (!this.path) {
            return q.reject({
                type: 'noPath',
                message: 'Path for redis properties is null or falsy'
            });
        }

        // return a promise wrapping true
        return q.fcall(function () {
            return true;
        });
    };

    /**
     * Resource.isRequestValid
     * @description Determine whether client-side resource is valid
     * @param {string} path Unparameterized path to resource instance 
     * @param {array} parameters List of parameters to apply to path 
     * @return {promise} Promise returning true, or rejection if request is invalid
     */

    Resource.prototype.isRequestValid = function (path, parameters) {
        return q.fcall(function () {
            return path.split('%s').length - 1 === parameters.length;
        })
        .then(function (matches) {
            return matches
                ? q.fcall(function () { return matches; })
                : q.reject({
                    type: 'parametersDoNotMatch',
                    message: "parameters given for request do not match the resource's path"
                });
        });
    };

    /**
     * Resource.idExists
     * @description Check whether ID exists in given path
     * @param {string} path Parameterized path to set of resource IDs 
     * @param {string} id ID to check for
     * @return {promise} Promise returning true or false
     */

    Resource.prototype.idExists = function (path, id) {
        return this.redisClient.sismember(path, id)
            .then(function (result) {
                return result > 0
                    ? q.fcall(function () { return true; })
                    : q.fcall(function () { return false; });
            });
    };

    /**
     * Resource.generateID
     * @description Create an ID for a new resource
     * @param {string} path Parameterized path to set of resource IDs 
     * @return {promise} Promise returning ID, or rejection if path does not exist
     */

    Resource.prototype.generateID = function (path) {
        var idGenPath = path + '/_id';

        return this.redisClient.incr(idGenPath);
    };

    return Resource;

})();
