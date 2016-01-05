
/**
 * Application store for all beacon data.
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
        <Module name='BeaconsStore' factory={ module.exports.factory }>
            <Dependency name='Actions' />
            <Dependency name='AppDispatcher' />
            <Dependency name='Events' />
        </Module>
    );

};

module.exports.factory = function (Actions, AppDispatcher, Events) {
    'use strict';

    /**
     * Packaged dependencies
     */
    var EventEmitter = require('events').EventEmitter;
    var _ = require('underscore')._;
    var vargs = require('vargs').Constructor;

    /**
     * Application store for all beacon data.
     *
     * @exports stores/BeaconsStore
     */

    var BeaconsStore = Object.create(EventEmitter.prototype);

    var beacons = {};

    /**
     * Emit the BeaconsStoreChanged event.
     */

    BeaconsStore.emitChanged = function () {
        this.emit(Events.BeaconsStoreChanged);
    };

    /**
     * Add a listener for the BeaconsStoreChanged event.
     *
     * @param {function} fn - event handler callback to bind to the event
     */

    BeaconsStore.addChangedListener = function (fn) {
        this.on(Events.BeaconsStoreChanged, fn);
    };

    /**
     * Remove a listener on the BeaconsStoreChanged event.
     *
     * @param {function} fn - event handler callback to unbind from the event
     */

    BeaconsStore.removeChangedListener = function (fn) {
        this.removeListener(Events.BeaconsStoreChanged, fn);
    };

    /**
     * Add a new beacon to the in-memory store.
     *
     * @param {Object} beacon - new beacon to add
     */

    BeaconsStore.addBeacon = function (beacon) {
        beacons[beacon.id] = beacon;
    };

    /**
     * Add multiple new beacons to the in-memory store.
     *
     * @param {Object[]} newBeacons - collection of new beacons to add
     */

    BeaconsStore.addBeacons = function (newBeacons) {
        _.each(newBeacons, function (beacon) {
            beacons[beacon.id] = beacon;
        });
    };

    /**
     * Flush all beacons from the in-memory store.
     */

    BeaconsStore.clearBeacons = function () {
        beacons = {};
    };

    /**
     * Return all beacons currently in the in-memory store.
     *
     * @returns {Object[]} All beacons currently in the in-memory store
     */

    BeaconsStore.getBeacons = function () {
        return _.values(beacons);
    };

    BeaconsStore.dispatchToken = AppDispatcher.register(function (action) {
        switch (action.type) {
            case Actions.CreateBeacon: {
                BeaconsStore.addBeacon(action.beacon);
                BeaconsStore.emitChanged();
                break;
            }

            case Actions.ReloadBeacons: {
                BeaconsStore.clearBeacons();
                BeaconsStore.addBeacons(action.beacons);
                BeaconsStore.emitChanged();
            }

            default: {
                break;
            }
        }
    });

    return BeaconsStore;

};
