
module.exports = (function () {
    'use strict';

    var React = require('react');

    var BeaconsResourceActions = require('../actions/BeaconsResourceActions')
      , BeaconsStore = require('../stores/BeaconsStore')
      , StoreStateComponentFactory = require('./factories/StoreStateComponent.react.jsx');

    var BeaconsMap = React.createClass({

        componentDidMount: function () {
            // Trigger a full reload of the BeaconsStore
            BeaconsResourceActions.reloadBeacons();
        },

        render: function () {
            return (
                <div className="beacon-map row">
                    <h3>Nothing here yet :)</h3>
                </div>
            );
        }

    });

    // Mixin StoreStateComponent functionality for the BeaconsStore
    return StoreStateComponentFactory(BeaconsMap, BeaconsStore, function (store) {
        return {
            beacons: store.getBeacons()
        };
    });

})();
