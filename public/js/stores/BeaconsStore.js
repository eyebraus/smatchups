
module.exports = (function () {
    'use strict';

    var _ = require('underscore')._;

    var Actions = require('../constants/Actions')
      , AppDispatcher = require('../dispatchers/AppDispatcher')
      , EventEmitter = require('events').EventEmitter
      , Events = require('../constants/Events');

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
            case Actions.ReloadBeacons:
                BeaconsStore.clearBeacons();
                BeaconsStore.addBeacons(action.beacons);
                BeaconsStore.emitChanged();

            default:
                break;
        }
    });

    return BeaconsStore;

})();
