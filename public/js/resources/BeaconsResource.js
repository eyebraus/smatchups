
module.exports.config = function () {
    'use strict';

    /**
     * npm dependencies
     */
    var React = require('react');

    /**
     * Local dependencies
     */
    var Dependency = require('../injector').Dependency,
        Module = require('../injector').Module;

    return (
        <Module name="BeaconsResource" factory={ module.exports.factory }>
            <Dependency name="httpPromise" />
        </Module>
    );
};

module.exports.factory = function (httpPromise) {
    'use strict';

    return {

        all: function () {
            return httpPromise.get('/beacons', {
                headers: {
                    'Accept': 'application/json'
                }
            });
        },

        create: function (beacon) {
            return httpPromise.post('/beacons', { document: beacon }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

    };

};
