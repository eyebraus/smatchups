
module.exports = (function () {
    'use strict';

    var Actions = require('../constants/Actions')
      , AppDispatcher = require('../dispatchers/AppDispatcher')
      , BeaconsResource = require('../resources/BeaconsResource');

    return {

        getBeacons: function () {
            BeaconsResource.all()
                .then(function (beacons) {
                    AppDispatcher.handleServerAction({
                        type: Actions.ListBeacons,
                        beacons: beacons
                    });
                });
        }

    };

})();
