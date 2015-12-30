
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
        <Module name='geoPromise' factory={ module.exports.factory } />
    );

};

module.exports.factory = function () {
    'use strict';

    /**
     * Packaged dependencies
     */
    var q = require('q');

    return {

        getCurrentPosition: function () {
            var deferral = q.defer();

            if (typeof navigator.geolocation === 'undefined') {
                deferral.reject({
                    type: 'geolocationIsUndefined',
                    message: 'Geolocation API is not supported or is not '
                        + 'present in browser',
                });
            } else {
                navigator.geolocation.getCurrentPosition(
                    function (pos) {
                        deferral.resolve(pos);
                    },
                    function (err) {
                        var errCodeMap = {
                            PERMISSION_DENIED: 'permissionDenied',
                            POSITION_UNAVAILABLE: 'positionUnavailable',
                            TIMEOUT: 'requestTimedOut',
                        };

                        deferral.reject({
                            type: errCodeMap[err.code],
                            message: err.message,
                        });
                    });
            }

            return deferral.promise;
        },

    };

};
