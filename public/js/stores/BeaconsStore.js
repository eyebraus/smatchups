
module.exports.config = function () {
    'use strict';

    /**
     * Local dependencies
     */
    var Dependency = require('./injector').Dependency
      , Module = require('./injector').Module
        ;

    return (
        <Module name="BeaconsStore" factory={ module.exports.factory }>
            <Dependency name="Actions" />
            <Dependency name="AppDispatcher" />
            <Dependency name="Events" />
        </Module>
    );
};

module.exports.factory = function (Actions, AppDispatcher, Events) {
    'use strict';

    /**
     * npm dependencies
     */
    var EventEmitter = require('events').EventEmitter
      , _ = require('underscore')._
      , vargs = require('vargs').Constructor;

    var BeaconsStore = Object.create(EventEmitter.prototype);

    var beacons = {};

    BeaconsStore.emitChanged = function () {
        this.emit(Events.BeaconsStoreChanged);
    };

    BeaconsStore.addChangedListener = function (fn) {
        this.on(Events.BeaconsStoreChanged, fn);
    };

    BeaconsStore.removeChangedListener = function (fn) {
        this.removeListener(Events.BeaconsStoreChanged, fn);
    };

    BeaconsStore.addBeacon = function (beacon) {
        beacons[beacon.id] = beacon;
    };

    BeaconsStore.addBeacons = function (newBeacons) {
        _.each(newBeacons, function (beacon) {
            beacons[beacon.id] = beacon;
        });
    };

    BeaconsStore.clearBeacons = function () {
        beacons = {};
    };

    BeaconsStore.getBeacons = function () {
        return _.values(beacons);
    };

    BeaconsStore.dispatchToken = AppDispatcher.register(function (action) {
        switch (action.type) {
            case Actions.CreateBeacon:
                BeaconsStore.addBeacon(action.beacon);
                BeaconsStore.emitChanged();

            case Actions.ReloadBeacons:
                BeaconsStore.clearBeacons();
                BeaconsStore.addBeacons(action.beacons);
                BeaconsStore.emitChanged();

            default:
                break;
        }
    });

    return BeaconsStore;

};
