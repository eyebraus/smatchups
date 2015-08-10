
module.exports = (function () {
    'use strict';

    var Actions = require('../constants/Actions')
      , AppDispatcher = require('../dispatchers/AppDispatcher')
      , BeaconsResource = require('../resources/BeaconsResource');

    return {

        reloadBeacons: function () {
            BeaconsResource.all()
                .then(function (beacons) {
                    AppDispatcher.handleServerAction({
                        type: Actions.ReloadBeacons,
                        beacons: beacons
                    });
                });
        }

    };

})();
