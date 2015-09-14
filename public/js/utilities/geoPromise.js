
module.exports = (function () {
    'use strict';

    var q = require('q');

    return {
        getCurrentPosition: function () {
            var deferral = q.defer();

            if (typeof navigator.geolocation === 'undefined') {
                deferral.reject({
                    type: 'geolocationIsUndefined',
                    message: 'Geolocation API is not supported or is not present in browser'
                });
            } else {
                navigator.geolocation.getCurrentPosition(
                    function (pos) {
                        deferral.resolve(pos);
                    },
                    function (err) {
                        var errCodeMap = {
                            'PERMISSION_DENIED': 'permissionDenied',
                            'POSITION_UNAVAILABLE': 'positionUnavailable',
                            'TIMEOUT': 'requestTimedOut'
                        };

                        deferral.reject({
                            type: errCodeMap[err.code],
                            message: err.message
                        });
                    });
            }

            return deferral.promise;
        }
    };

})();
