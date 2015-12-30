
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
        <Module name='BeaconsResourceActions'
                factory={ module.exports.factory }>
            <Dependency name='Actions' />
            <Dependency name='AppDispatcher' />
            <Dependency name='BeaconsResource' />
        </Module>
    );

};

module.exports.factory = function (Actions, AppDispatcher, BeaconsResource) {
    'use strict';

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
                    sm4sh: formData.setupCountSm4sh,
                },
                userName: 'beerz4yearz',
            };

            return BeaconsResource.create(data)
                .then(function (beacon) {
                    AppDispatcher.handleServerAction({
                        type: Actions.CreateBeacon,
                        beacon: beacon,
                    });
                });
        },

        reloadBeacons: function () {
            BeaconsResource.all()
                .then(function (beacons) {
                    AppDispatcher.handleServerAction({
                        type: Actions.ReloadBeacons,
                        beacons: beacons,
                    });
                });
        },

    };

};
