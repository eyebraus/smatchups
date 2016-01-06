
/**
 * Promise-based utility for executing HTTP methods, i.e. GET, POST, etc.
 *
 * @module utility/httpPromise
 */

module.exports.config = function () {
    'use strict';

    /**
     * Packaged dependencies
     */
    var React = require('react');

    /**
     * Local dependencies
     */
    var Dependency = require('../injector').Dependency;
    var Module = require('../injector').Module;

    return (
        <Module name='httpPromise' factory={ module.exports.factory } />
    );

};

module.exports.factory = function () {
    'use strict';

    /**
     * Packaged dependencies
     */
    var http = require('http');
    var q = require('q');
    var _ = require('underscore')._;

    return {

        /**
         * Wraps node's http.get method in a promise.
         *
         * @param {string} path - path to issue a GET request against
         * @param {Object} options - additional options to pass to get method
         * @returns {promise} Promise resolved when all response data has been
         *      received and parsed. Promise rejected on any error condition,
         *      e.g. status 4xx or 5xx.
         */

        get: function (path, options) {
            var deferral = q.defer();
            var opts = _.clone(options);

            opts.path = path;

            http.get(opts, function (res) {
                var data = '';

                res.on('data', function (chunk) {
                    data += chunk;
                });

                res.on('end', function () {
                    deferral.resolve(JSON.parse(data));
                });
            }).on('error', function (err) {
                deferral.reject(err);
            });

            return deferral.promise;
        },

        /**
         * Issues node's http.request with POST method and wrap response in
         * promise.
         *
         * @param {string} path - path to issue a POST request against
         * @param {Object} body - data to attach to POST request
         * @param {Object} options - additional options to pass to request
         *      method
         * @returns {promise} Promise resolved when all response data has been
         *      received and parsed. Promise rejected on any error condition,
         *      e.g. status 4xx or 5xx.
         */

        post: function (path, body, options) {
            var deferral = q.defer();
            var bodyStr = JSON.stringify(body);
            var opts = _.clone(options);

            opts.method = 'POST';
            opts.path = path;
            opts.headers['Content-Length'] = bodyStr.length;

            var req = http.request(opts, function (res) {
                var data = '';

                res.on('data', function (chunk) {
                    data += chunk;
                });

                res.on('end', function () {
                    deferral.resolve(JSON.parse(data));
                });
            }).on('error', function (err) {
                deferral.reject(err);
            });

            req.end(bodyStr);

            return deferral.promise;
        },

    };

};
