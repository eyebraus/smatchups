
module.exports = (function () {
    'use strict';

    var Actions = require('../constants/Actions')
      , AppDispatcher = require('../dispatchers/AppDispatcher')
      , BeaconsResource = require('../resources/BeaconsResource');

    return {

        createBeaconFromForm: function (formData) {
            // Convert beacon form data into beacon model
            var data = {
                userName: 'beerz4yearz',
                profilePictureUrl: '/app/img/prof-pic-placekitten.png',
                games: formData.games,
                entryFee: formData.entryFee,
                message: formData.message
            };

            return BeaconsResource.create(data)
                .then(function (beacon) {
                    AppDispatcher.handleServerAction({
                        type: Actions.CreateBeacon,
                        beacon: beacon
                    });
                });
        },

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
