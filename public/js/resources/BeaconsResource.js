
/**
 * Promise-based RESTful wrapper around the HTTP APIs for beacons.
 *
 * @module resources/BeaconsResource
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
        <Module name='BeaconsResource' factory={ module.exports.factory }>
            <Dependency name='httpPromise' />
        </Module>
    );

};

module.exports.factory = function (httpPromise) {
    'use strict';

    return {

        /**
         * Fetch all beacon instances.
         *
         * @returns {promise} Promise resolved with all beacons returned as an
         *      array of JSON blobs. Promise is rejected in the event of any
         *      bad status codes, e.g. 4xx or 5xx.
         */

        all: function () {
            return httpPromise.get('/beacons', {
                headers: {
                    Accept: 'application/json',
                },
            });
        },

        /**
         * Create a new beacon.
         *
         * @param {Object} beacon - beacon document data
         * @returns {promise} Promise resolved with new beacon. This includes
         *      actual beacon data in addition to document metadata such as id,
         *      revision, timestamps, etc. Promise is rejected in the event of
         *      any bad status codes, e.g. 4xx or 5xx.
         */

        create: function (beacon) {
            return httpPromise.post('/beacons', { document: beacon }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        },

    };

};
