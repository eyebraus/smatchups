
module.exports = (function () {
    'use strict';

    /**
     * Packaged dependencies
     */
    var q = require('q');
    var _ = require('underscore')._;
    var util = require('util');
    var VargsConstructor = require('vargs').Constructor;
    var winston = require('winston');

    var log = new (winston.Logger)({
        transports: [new (winston.transports.Console)()],
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
     * @param {arguments} parameters Optional list of ids needed to resolve
     *      resource
     * @return {promise} Promise for all instances of this resource, or
     *      rejection if resource or request is invalid.
     */

    Resource.prototype.all = function (/* [parameters] */) {
        var that = this;
        var args = new (VargsConstructor)(arguments);

        return this.isValid()
            .then(function () {
                return that.isRequestValid(that.path, args.all)
            })
            .then(function () {
                return that.redisClient.smembers(that.expandedPath(args.all));
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
     * @param {arguments} parameters Optional list of ids needed to resolve
     *      resource
     * @param {object} document New document to create in repository
     * @return {promise} Promise returning copy of model w/ id & rev, or
     *      rejection if resource or request is invalid.
     */

    Resource.prototype.create = function (/* [parameters], document */) {
        var that = this;
        var args = new (VargsConstructor)(arguments);
        var parameters = args.all.slice(0, -1);
        var document = args.last;
        var expandedPath = this.expandedPath(parameters);
        var currentTimestamp = new Date().toString();

        return this.isValid()
            .then(function () {
                return that.isRequestValid(that.path, parameters);
            })
            .then(function () {
                // Create an identifier for the new resource
                return that.generateID(expandedPath);
            })
            .then(function (id) {
                var properties = that.expandProperties(id, parameters);

                return that.idExists(expandedPath, id)
                    .then(function (idExists) {
                        if (idExists) {
                            return q.reject({
                                type: 'idAlreadyExists',
                                message: util.format('ID "%s" already exists '
                                    + 'for path %s', id, expandedPath),
                            });
                        }

                        that.redisClient.watch(properties.id);
                        that.redisClient.multi();

                        that.redisClient.sadd(
                            that.expandedPath(parameters), id);
                        that.redisClient.set(properties.id, id);
                        that.redisClient.incr(properties.rev);
                        that.redisClient.set(
                            properties.createdAt, currentTimestamp);
                        that.redisClient.set(
                            properties.updatedAt, currentTimestamp);
                        that.redisClient.set(
                            properties.doc, JSON.stringify(document));

                        return that.redisClient.exec();
                    })
                    .then(function (results) {
                        var addResult = results[0];
                        var idResult = results[1];
                        var revResult = results[2];
                        var createdAtResult = results[3];
                        var updatedAtResult = results[4];
                        var docResult = results[5];
                        var isValid = true;

                        // Since redis won't fail an entire transaction due to
                        // one failed command, log any abnormal results from
                        // exec. If any are noted, write that the object is
                        // invalid back to the keystore.
                        _.each([['id', idResult],
                                ['createdAt', createdAtResult],
                                ['updatedAt', updatedAtResult],
                                ['doc', docResult],
                            ], function (tuple) {
                                var keyName = tuple[0];
                                var result = tuple[1];

                                if (result !== 'OK') {
                                    log.warn('Property "%s" was not correctly '
                                        + 'set for resource %s, id %s', keyName,
                                        that.path, id);
                                    isValid = false;
                                }
                            });

                        if (addResult <= 0) {
                            log.warn('id %s was not correctly added to id set '
                                + 'for resource %s', id, that.path);
                            isValid = false;
                        }

                        if (revResult <= 0) {
                            log.warn('rev was not correctly incremented for '
                                + 'resource %s, id %s', that.path, id);
                            isValid = false;
                        }

                        var data = {
                            id: id,
                            rev: revResult,
                            createdAt: currentTimestamp,
                            updatedAt: currentTimestamp,
                            document: document,
                            valid: isValid,
                        };

                        return that.redisClient.set(properties.valid,
                                isValid ? 1 : 0)
                            .then(function () {
                                if (isValid) {
                                    return q.fcall(function () {
                                        return data;
                                    });
                                }

                                return q.reject({
                                    type: 'instanceNotValid',
                                    message: util.format('Create '
                                        + 'transaction for resource %s, '
                                        + 'instance %s partially failed',
                                        that.path, id),
                                    data: data,
                                });
                            });
                    });
            });
    };

    /**
     * Resource.get
     * @description Query instance of resource with given id(s)
     * @param {arguments} parameters Optional list of ids needed to resolve
     *      resource
     * @return {promise} Promise for instance of resource with given id(s), or
     *      rejection if resource or request is invalid.
     */

    Resource.prototype.get = function (/* [parameters], id */) {
        var that = this;
        var args = new (VargsConstructor)(arguments);
        var id = args.at(-1);
        var expandedPath = this.expandedPath(args.all.slice(0, -1));
        var properties = this.expandProperties(id, args.all.slice(0, -1));

        return this.isValid()
            .then(function () {
                return that.isRequestValid(that.propertyTemplates().id,
                    args.all);
            })
            .then(function () {
                return that.idExists(expandedPath, id);
            })
            .then(function (idExists) {
                if (!idExists) {
                    return q.reject({
                        type: 'idDoesNotExist',
                        message: util.format('ID "%s" does not exist for path '
                            + '%s', id, expandedPath),
                    });
                }

                return that.redisClient.get(properties.valid);
            })
            .then(function (valid) {
                if (valid <= 0) {
                    return q.reject({
                        type: 'instanceNotValid',
                        message: util.format('Requested id "%s" is not marked '
                            + 'as valid', id),
                    });
                }

                return q.all([
                        that.redisClient.get(properties.id),
                        that.redisClient.get(properties.rev),
                        that.redisClient.get(properties.createdAt),
                        that.redisClient.get(properties.updatedAt),
                        that.redisClient.get(properties.doc),
                    ])
                    .then(function (results) {
                        return q.fcall(function () {
                            return {
                                id: results[0],
                                rev: results[1],
                                createdAt: results[2],
                                updatedAt: results[3],
                                document: JSON.parse(results[4]),
                                valid: valid > 0,
                            };
                        });
                    });
            });
    };

    /**
     * Resource.edit
     * @description Edit instance of existing resource in repository
     * @param {arguments} parameters Optional list of ids needed to resolve
     *      resource
     * @param {string} id Resource ID in repository
     * @param {string} rev Resource revision in repository
     * @param {string} document New content to write to resource
     * @return {promise} Promise returning copy of resource w/ id & rev, or
     *      rejection if request is invalid.
     */

    Resource.prototype.edit = function (/* [parameters], id, rev, document */) {
        var that = this;
        var args = new (VargsConstructor)(arguments);
        var pathParameters = args.all.slice(0, -2);
        var id = args.at(-3);
        var rev = args.at(-2);
        var document = args.at(-1);
        var expandedPath = this.expandedPath(args.all.slice(0, -3));
        var properties = this.expandProperties(id, args.all.slice(0, -3));
        var currentTimestamp = new Date().toString();

        return this.isValid()
            .then(function () {
                return that.isRequestValid(that.propertyTemplates().id,
                    pathParameters);
            })
            .then(function () {
                return that.idExists(expandedPath, id);
            })
            .then(function (idExists) {
                if (!idExists) {
                    return q.reject({
                        type: 'idDoesNotExist',
                        message: util.format('ID "%s" does not exist for path '
                            + '%s', id, expandedPath),
                    });
                }

                return that.redisClient.get(properties.valid);
            })
            .then(function (valid) {
                if (valid <= 0) {
                    return q.reject({
                        type: 'instanceNotValid',
                        message: util.format('Requested id "%s" is not marked '
                            + 'as valid', id),
                    });
                }

                that.redisClient.watch(properties.rev);

                return that.redisClient.get(properties.rev);
            })
            .then(function (serverRev) {
                if (rev !== serverRev) {
                    that.redisClient.unwatch(properties.rev);

                    return q.reject({
                        type: 'revIsOutOfDate',
                        message: 'Client revision did not match server before '
                            + 'transaction',
                    });
                }

                that.redisClient.multi();
                that.redisClient.incr(properties.rev);
                that.redisClient.get(properties.createdAt);
                that.redisClient.set(properties.updatedAt, currentTimestamp);
                that.redisClient.set(properties.doc, JSON.stringify(document));

                return that.redisClient.exec();
            })
            .then(function (results) {
                var newRev = results[0];
                var createdAt = results[1];
                var updatedAtResult = results[2];
                var docResult = results[3];
                var isValid = true;

                // Since redis won't fail an entire transaction due to one
                // failed command, log any abnormal results from exec. If any
                // are noted, write that the object is invalid back to the
                // keystore.
                _.each([['updatedAt', updatedAtResult],
                        ['doc', docResult],
                    ], function (tuple) {
                        var keyName = tuple[0];
                        var result = tuple[1];

                        if (result !== 'OK') {
                            log.warn('Property "%s" was not correctly set for '
                                + 'resource %s, id %s', keyName, that.path, id);
                            isValid = false;
                        }
                    });

                var data = {
                    id: id,
                    rev: newRev,
                    createdAt: createdAt,
                    updatedAt: currentTimestamp,
                    document: document,
                    valid: isValid,
                };

                return that.redisClient.set(properties.valid, isValid ? 1 : 0)
                    .then(function () {
                        if (isValid) {
                            return q.fcall(function () {
                                return data;
                            });
                        }

                        return q.reject({
                            type: 'instanceNotValid',
                            message: util.format('Edit transaction for '
                                + 'resource %s, instance %s partially '
                                + 'failed', that.path, id),
                            data: data,
                        });
                    });
            });
    };

    /**
     * Resource.delete
     * @description Delete instance of resource in repository
     * @param {arguments} parameters Optional list of ids needed to resolve
     *      resource
     * @param {string} id Resource ID in repository
     * @param {string} rev Resource revision in repository
     * @return {promise} Promise returning true, or rejection if request is
     *      invalid.
     */

    Resource.prototype.delete = function (/* [parameters], id, rev */) {
        var that = this;
        var args = new (VargsConstructor)(arguments);
        var pathParameters = args.all.slice(0, -1);
        var id = args.at(-2);
        var rev = args.at(-1);
        var expandedPath = this.expandedPath(args.all.slice(0, -2));
        var properties = this.expandProperties(id, args.all.slice(0, -2));

        return this.isValid()
            .then(function () {
                return that.isRequestValid(that.propertyTemplates().id,
                    pathParameters);
            })
            .then(function () {
                return that.idExists(expandedPath, id);
            })
            .then(function (idExists) {
                if (!idExists) {
                    return q.reject({
                        type: 'idDoesNotExist',
                        message: util.format('ID "%s" does not exist for path '
                            + '%s', id, expandedPath),
                    });
                }

                that.redisClient.watch(properties.rev);

                return that.redisClient.get(properties.rev);
            })
            .then(function (serverRev) {
                if (rev !== serverRev) {
                    that.redisClient.unwatch(properties.rev);

                    return q.reject({
                        type: 'revIsOutOfDate',
                        message: 'Client revision did not match server before '
                            + 'transaction',
                    });
                }

                that.redisClient.multi();
                that.redisClient.del(properties.id);
                that.redisClient.del(properties.rev);
                that.redisClient.del(properties.createdAt);
                that.redisClient.del(properties.updatedAt);
                that.redisClient.del(properties.doc);
                that.redisClient.del(properties.valid);
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
     * Resource.expandedPath
     * @description Return a fully-qualified expanded base path for the given
     *      arguments
     * @param {array} args List of arguments for path template
     * @return {string} Full path to resource, with given arguments
     */

    Resource.prototype.expandedPath = function (args) {
        return expandProperty(this.path, args);
    };

    /**
     * Resource.propertyTemplates
     * @description Create template key names for resource instances
     * @return {object} All template key names for resource instances
     */

    Resource.prototype.propertyTemplates = function () {
        return {
            id: this.path + ':%s/id',
            rev: this.path + ':%s/rev',
            createdAt: this.path + ':%s/createdAt',
            updatedAt: this.path + ':%s/updatedAt',
            doc: this.path + ':%s/doc',
            valid: this.path + ':%s/valid',
        };
    };

    /**
     * Resource.expandedProperties
     * @description Return all fully-qualified expanded properties for a
     *      resource instance
     * @param {string} id ID of resource instance
     * @param {array} args List of args for path template
     * @return {object} All expanded properties for resource instance
     */

    Resource.prototype.expandProperties = function (id, args) {
        var templates = this.propertyTemplates();
        var allArguments = args.concat([id]);

        return {
            id: expandProperty(templates.id, allArguments),
            rev: expandProperty(templates.rev, allArguments),
            createdAt: expandProperty(templates.createdAt, allArguments),
            updatedAt: expandProperty(templates.updatedAt, allArguments),
            doc: expandProperty(templates.doc, allArguments),
            valid: expandProperty(templates.valid, allArguments),
        };
    };

    /**
     * Resource.isValid
     * @description Determine whether client-side resource is valid
     * @return {promise} Promise returning true, or rejection if resource is
     *      invalid
     */

    Resource.prototype.isValid = function () {
        // Reject if any of the constructor arguments were falsy
        if (!this.redisClient) {
            return q.reject({
                type: 'noRedisClient',
                message: 'Client for redis requests is null or falsy',
            });
        }

        if (!this.path) {
            return q.reject({
                type: 'noPath',
                message: 'Path for redis properties is null or falsy',
            });
        }

        // Return a promise wrapping true
        return q.fcall(function () {
            return true;
        });
    };

    /**
     * Resource.isRequestValid
     * @description Determine whether client-side resource is valid
     * @param {string} path Unparameterized path to resource instance
     * @param {array} parameters List of parameters to apply to path
     * @return {promise} Promise returning true, or rejection if request is
     *      invalid
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
                    message: 'parameters given for request do not match the '
                        + 'resource\'s path',
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
     * @return {promise} Promise returning ID, or rejection if path does not
     *      exist
     */

    Resource.prototype.generateID = function (path) {
        var idGenPath = path + '/_id';

        return this.redisClient.incr(idGenPath);
    };

    return Resource;

})();
