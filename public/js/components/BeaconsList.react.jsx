
module.exports = (function () {
    'use strict';

    var React = require('react')
      , Router = require('react-router')
      , Link = Router.Link
      , _ = require('underscore')._;

    var BeaconsResourceActions = require('../actions/BeaconsResourceActions')
      , BeaconsStore = require('../stores/BeaconsStore')
      , StoreStateComponentFactory = require('./factories/StoreStateComponent.react.jsx');

    var BeaconsList = React.createClass({

        componentDidMount: function () {
            // Trigger a full reload of the BeaconsStore
            BeaconsResourceActions.reloadBeacons();
        },

        render: function () {
            return (
                <div className="beacons-list col-xs-12 col-sm-12 col-md-12">
                    { this.beaconRows() }
                </div>
            );
        },

        beaconRows: function () {
            return _.map(this.props.beacons, function (beacon) {
                return (
                    <div key={ beacon.id } className="beacon-row row">
                        <div className="beacon-image-frame col-xs-3 col-sm-3 col-md-3">
                            <img src={ beacon.document.profilePictureUrl } />
                        </div>

                        <div className="beacon-content-frame col-xs-9 col-sm-9 col-md-9">
                            <div className="beacon-content-header row">
                                <h3>{ beacon.document.userName }</h3>
                                <img src={ beacon.document.gameIcon } />
                                <span className="beacon-timestamp">{ beacon.createdAt }</span>
                            </div>

                            <div className="beacon-content-body row">
                                { beacon.document.message }
                            </div>
                        </div>
                    </div>
                );
            });
        }

    });

    // Mixin StoreStateComponent functionality for the BeaconsStore
    return StoreStateComponentFactory(BeaconsList, BeaconsStore, function (store) {
        return {
            beacons: store.getBeacons()
        };
    });

})();
