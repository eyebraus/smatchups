
module.exports = (function () {
    'use strict';

    var React = require('react')
      , Column = require('react-bootstrap').Column
      , Row = require('react-bootstrap').Row
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
                <Column xs={ 12 } sm={ 12 } md={ 12 } className="beacons-list">
                    { this.beaconRows() }
                </Column>
            );
        },

        beaconRows: function () {
            var that = this;

            return _.map(this.props.beacons, function (beacon) {
                return (
                    <Row key={ beacon.id } className="beacon-row">
                        <Column xs={ 3 } sm={ 3 } md={ 3 } className="beacon-image-frame">
                            <img src={ beacon.document.profilePictureUrl } />
                        </Column>

                        <Column xs={ 9 } sm={ 9 } md={ 9 } className="beacon-content-frame">
                            <Row className="beacon-content-header">
                                <h3>{ beacon.document.userName }</h3>
                                <div className="beacon-games-ribbon">
                                    { that.gamesRibbonIcons(beacon.document.games) }
                                </div>
                                <span className="beacon-timestamp">{ new Date(beacon.createdAt).toLocaleString('en-US') }</span>
                            </Row>

                            <Row className="beacon-content-body">
                                { beacon.document.message }
                            </Row>
                        </Column>
                    </Row>
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
