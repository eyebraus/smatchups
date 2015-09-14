
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
            var that = this;

            return _.map(this.props.beacons, function (beacon) {
                return (
                    <div key={ beacon.id } className="beacon-row row">
                        <div className="beacon-image-frame col-xs-3 col-sm-3 col-md-3">
                            <img src={ beacon.document.profilePictureUrl } />
                        </div>

                        <div className="beacon-content-frame col-xs-9 col-sm-9 col-md-9">
                            <div className="beacon-content-header row">
                                <h3>{ beacon.document.userName }</h3>
                                <div className="beacon-games-ribbon">
                                    { that.gamesRibbonIcons(beacon.document.games) }
                                </div>
                                <span className="beacon-timestamp">{ new Date(beacon.createdAt).toLocaleString('en-US') }</span>
                            </div>

                            <div className="beacon-content-body row">
                                { beacon.document.message }
                            </div>
                        </div>
                    </div>
                );
            });
        },

        gamesRibbonIcons: function (games) {
            return _.map(games, function (game) {
                var gameImage = '/app/img/icon/smash-franchise-toggle.png';

                switch(game) {
                    case 'smash64':
                        gameImage = '/app/img/icon/smash-64-toggle.png';
                        break;

                    case 'melee':
                        gameImage = '/app/img/icon/melee-toggle.png';
                        break;
                    
                    case 'projectM':
                        gameImage = '/app/img/icon/project-m-toggle.png';
                        break;
                    
                    case 'sm4sh':
                        gameImage = '/app/img/icon/sm4sh-toggle.png';
                        break;
                }

                return (
                    <img key={ game } src={ gameImage } width="24" height="24" className="beacon-games-ribbon-icon" />
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
