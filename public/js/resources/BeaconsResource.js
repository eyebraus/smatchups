
module.exports = (function () {
    'use strict';

    var httpPromise = require('../utilities/httpPromise');

    return {

        all: function () {
            return httpPromise.get('/beacons', {
                headers: {
                    'Accept': 'application/json'
                }
            });
        }

    };

})();
