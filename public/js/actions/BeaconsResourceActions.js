
/**
 * Issues actions on the BeaconsResource, e.g. creating beacons from form info,
 * getting all beacons in the backend.
 *
 * @module actions/BeaconsResourceActions
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

    /**
     * Functions for issuing actions on the BeaconsResource.
     *
     * @exports actions/BeaconsResourceActions
     */

    return {

        /**
         * Issues request to create a new beacon, based on data obtained from a
         * form.
         *
         * @param {Object} formData - beacon data obtained from an HTML form
         * @returns {promise} Promise resolved when the new beacon is created,
         *      returning the new beacon instance. Promise is rejected in the
         *      case of any 4xx or 5xx errors.
         */

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

        /**
         * Gets all beacons from the backend.
         *
         * @returns {promise} Promise resolved when all beacons are retrieved.
         * Promise rejected in the case of any 4xx or 5xx status.
         */

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
