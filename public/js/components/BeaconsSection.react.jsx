
module.exports = (function () {
    'use strict';

    var React = require('react')
      , ButtonGroup = require('react-bootstrap').ButtonGroup
      , Col = require('react-bootstrap').Col
      , PageHeader = require('react-bootstrap').PageHeader
      , Row = require('react-bootstrap').Row
      , GoogleMap = require('react-google-maps').GoogleMap
      , Marker = require('react-google-maps').Marker
      , SearchBox = require('react-google-maps').SearchBox
      , Router = require('react-router')
      , TimeAgo = require('react-timeago')
      , _ = require('underscore')._;

    var BeaconsResourceActions = require('../actions/BeaconsResourceActions')
      , BeaconsStore = require('../stores/BeaconsStore')
      , geoPromise = require('../utilities/geoPromise')
      , StoreStateComponentFactory = require('./factories/StoreStateComponent.react.jsx')
      , ToggleImageButton = require('./ToggleImageButton.react.jsx');

    var BeaconsSection = React.createClass({

        getInitialState: function () {
            return {
                bounds: null,
                center: { lat: 47.6201451, lng: -122.3298646 },
                isSmash64Enabled: false,
                isMeleeEnabled: true,
                isProjectMEnabled: false,
                isSm4shEnabled: false
            };
        },

        componentDidMount: function () {
            var that = this;

            // Trigger a full reload of the BeaconsStore
            BeaconsResourceActions.reloadBeacons();

            geoPromise.getCurrentPosition()
                .then(function (position) {
                    that.setState({
                        center: { lat: position.coords.latitude, lng: position.coords.longitude }
                    });
                });
        },

        onBoundsChanged: function () {
            this.setState({
                bounds: this.refs.map.getBounds(),
                center: this.refs.map.getCenter()
            });
        },

        onPlacesChanged: function () {
            var places = this.refs.searchBox.getPlaces();

            if (places.length > 0) {
                this.setState({
                    center: places[0].geometry.location
                });
            }
        },
        
        onToggledFactory: function (keyName) {
            var that = this;

            return function (toggleState) {
                var newState = {};
                newState[keyName] = toggleState;

                that.setState(newState);
            };
        },

        render: function () {
            return (
                <Row>
                    <Col xs={ 12 } sm={ 12 } md={ 12 } className="beacons-section-wrapper">
                        <Row className="beacons-section-header">
                            <PageHeader className="section-header">Beacons</PageHeader>
                        </Row>

                        <Row className="beacons-section-filters">
                            <Col xs={ 12 } sm={ 12 } md={ 12 }>
                                <ButtonGroup justified>
                                    <ButtonGroup>
                                        <ToggleImageButton
                                                imageUrl="/app/img/icon/smash-64-toggle.png"
                                                imageWidth="24"
                                                imageHeight="24"
                                                text="Super Smash Bros. 64"
                                                toggleState={ this.state.isSmash64Enabled }
                                                onToggled={ this.onToggledFactory('isSmash64Enabled') } />
                                    </ButtonGroup>

                                    <ButtonGroup>
                                        <ToggleImageButton
                                                imageUrl="/app/img/icon/melee-toggle.png"
                                                imageWidth="24"
                                                imageHeight="24"
                                                text="Super Smash Bros. Melee"
                                                toggleState={ this.state.isMeleeEnabled }
                                                onToggled={ this.onToggledFactory('isMeleeEnabled') } />
                                    </ButtonGroup>

                                    <ButtonGroup>
                                        <ToggleImageButton
                                                imageUrl="/app/img/icon/project-m-toggle.png"
                                                imageWidth="24"
                                                imageHeight="24"
                                                text="Project M"
                                                toggleState={ this.state.isProjectMEnabled }
                                                onToggled={ this.onToggledFactory('isProjectMEnabled') } />
                                    </ButtonGroup>

                                    <ButtonGroup>
                                        <ToggleImageButton
                                                imageUrl="/app/img/icon/sm4sh-toggle.png"
                                                imageWidth="24"
                                                imageHeight="24"
                                                text="Super Smash Bros. for Wii U"
                                                toggleState={ this.state.isSm4shEnabled }
                                                onToggled={ this.onToggledFactory('isSm4shEnabled') } />
                                    </ButtonGroup>
                                </ButtonGroup>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={ 6 } sm={ 6 } md={ 6 } className="beacons-list">
                                { this.beaconRows() }
                            </Col>

                            <Col xs={ 6 } sm={ 6 } md={ 6 } className="beacons-map">
                                <GoogleMap
                                        center={ this.state.center }
                                        containerProps={ {
                                            style: {
                                                height: '800px'
                                            }
                                        } }
                                        defaultZoom={ 15 }
                                        onBoundsChanged={ this.onBoundsChanged }
                                        ref="map">

                                    <SearchBox
                                            bounds={ this.state.bounds }
                                            classes="google-maps-search-box"
                                            controlPosition={ google.maps.ControlPosition.TOP_LEFT }
                                            onPlacesChanged={ this.onPlacesChanged }
                                            ref="searchBox" />

                                    { this.props.beacons.map(function (beacon, index) {
                                        <Marker key={ index } position={ beacon.position } />
                                    }) }

                                </GoogleMap>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            );
        },

        beaconRows: function () {
            var that = this;

            return _.map(this.props.beacons, function (beacon) {
                return (
                    <div key={ beacon.id } className="beacon-row">
                        <div className="beacon-frame beacon-image-frame">
                            <img src={ beacon.document.profilePictureUrl } className="img-circle" />
                        </div>

                        <div className="beacon-frame beacon-content-frame">
                            <div className="beacon-content-header">
                                <h4>{ beacon.document.userName }</h4>
                            </div>

                            <div className="beacon-content-body">
                                <p>{ beacon.document.message }</p>
                            </div>
                        </div>

                        <div className="beacon-frame beacon-info-frame">
                            <div className="beacon-timestamp">
                                <TimeAgo date={ new Date(beacon.createdAt).toLocaleString('en-US') } />
                            </div>

                            <div className="beacon-games-ribbon">
                                { that.gamesRibbonIcons(beacon.document.games) }
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
    return StoreStateComponentFactory(BeaconsSection, BeaconsStore, function (store) {
        return {
            beacons: store.getBeacons()
        };
    });

})();
