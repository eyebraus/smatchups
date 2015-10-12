
module.exports = (function () {
    'use strict';

    var Actions = require('../constants/Actions')
      , AppDispatcher = require('../dispatchers/AppDispatcher')
      , BeaconsResource = require('../resources/BeaconsResource');

    return {

        createBeaconFromForm: function (formData) {
            // Convert beacon form data into beacon model
            var data = {
                address: formData.address,
                attendees: [],
                capacity: formData.capacity,
                expiresInMinutes: formData.expiresInMinutes,
                location: formData.location,
                message: formData.message,
                name: formData.name,
                profilePictureUrl: '/app/img/prof-pic-placekitten.png',
                setups: {
                    smash64: formData.setupCountSmash64,
                    melee: formData.setupCountMelee,
                    projectM: formData.setupCountProjectM,
                    sm4sh: formData.setupCountSm4sh
                },
                userName: 'beerz4yearz'
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
