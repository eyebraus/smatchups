
module.exports = (function () {
    'use strict';

    var Actions = require('../constants/Actions')
      , AppDispatcher = require('../dispatcher/AppDispatcher')
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

    BeaconsStore.addBeacons = function (beacons) {
        _.each(beacons, function (beacon) {
            beacons[beacon.id] = beacon;
        });
    };

    BeaconsStore.getBeacons = function () {
        return _.values(beacons);
    };

    BeaconsStore.dispatchToken = AppDispatcher.register(function (payload) {
        var action = payload.action;

        switch (action.type) {
            case Actions.ListBeacons:
                BeaconsStore.addBeacons(action.beacons);
                BeaconsStore.emitChanged();

            default:
                break;
        }
    });

    return BeaconsStore;

})();
