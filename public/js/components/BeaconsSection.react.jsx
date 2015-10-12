
module.exports = (function () {
    'use strict';

    var React = require('react')
      , Button = require('react-bootstrap').Button
      , ButtonGroup = require('react-bootstrap').ButtonGroup
      , ButtonInput = require('react-bootstrap').ButtonInput
      , ButtonToolbar = require('react-bootstrap').ButtonToolbar
      , Col = require('react-bootstrap').Col
      , Input = require('react-bootstrap').Input
      , PageHeader = require('react-bootstrap').PageHeader
      , Panel = require('react-bootstrap').Panel
      , Row = require('react-bootstrap').Row
      , GoogleMap = require('react-google-maps').GoogleMap
      , Marker = require('react-google-maps').Marker
      , SearchBox = require('react-google-maps').SearchBox
      , Link = require('react-router').Link
      , TimeAgo = require('react-timeago')
      , _ = require('underscore')._;

    var Autocomplete = require('./Autocomplete.react.jsx')
      , BeaconForm = require('./BeaconForm.react.jsx')
      , BeaconsResourceActions = require('../actions/BeaconsResourceActions')
      , BeaconsStore = require('../stores/BeaconsStore')
      , geoPromise = require('../utilities/geoPromise')
      , SetupInputElement = require('./SetupInputElement.react.jsx')
      , StoreStateComponentFactory = require('./factories/StoreStateComponent.react.jsx')
      , ToggleImageButton = require('./ToggleImageButton.react.jsx');

    var BeaconsSection = React.createClass({

        getInitialState: function () {
            return {
                bounds: null,
                center: { lat: 47.6201451, lng: -122.3298646 },
                currentLocation: null,
                isFormActive: false,
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
                        center: { lat: position.coords.latitude, lng: position.coords.longitude },
                        currentLocation: { lat: position.coords.latitude, lng: position.coords.longitude }
                    });
                });
        },

        hideForm: function () {
            this.setState({ isFormActive: false });
        },

        onBoundsChanged: function () {
            this.setState({
                bounds: this.refs.map.getBounds(),
                center: this.refs.map.getCenter()
            });
        },

        onFormSubmitted: function (beacon) {
            var that = this;

            BeaconsResourceActions.createBeaconFromForm(beacon)
                .then(function () {
                    that.hideForm();
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

        showForm: function ()  {
            this.setState({ isFormActive: true });
        },

        render: function () {
            var createRowClassNames = this.state.isFormActive
                ? "beacon-row new-beacon-form"
                : "beacon-row new-beacon-row";

            return (
                <Row className="beacons-section">
                    <Col xs={ 12 } sm={ 12 } md={ 12 } className="beacons-filters">
                        { this.beaconsFilters() }
                    </Col>

                    <Col xs={ 6 } sm={ 6 } md={ 6 } className="beacons-list-and-form">
                        <div key="post-new" className={ createRowClassNames }>
                            { this.state.isFormActive
                                ? <BeaconForm
                                        bounds={ this.state.bounds }
                                        onCancel={ this.hideForm } 
                                        onSubmit={ this.onFormSubmitted }/>
                                : this.createBeaconRow() }
                        </div>

                        { !this.state.isFormActive
                            ? this.beaconsList()
                            : <noscript /> }
                    </Col>

                    <Col xs={ 6 } sm={ 6 } md={ 6 } className="beacons-map" data-spy="affix" data-offset-top="58">
                        { this.beaconsMap() }
                    </Col>
                </Row>
            );
        },

        beaconsFilters: function () {
            return (
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
            );
        },

        createBeaconRow: function () {
            return (
                <div onClick={ this.showForm }>
                    <div className="beacon-frame beacon-icon-frame">
                        <i className="fa fa-plus fa-4" />
                    </div>

                    <div className="beacon-frame beacon-content-frame">
                        <div className="beacon-content-header">
                            <h3>Create a new beacon!</h3>
                        </div>

                        <div className="beacon-content-body">
                            <p>Let your friends know when, where, and what you're playing.</p>
                        </div>
                    </div>
                </div>
            );
        },

        beaconsList: function () {
            var that = this;

            return _.map(this.props.beacons, function (beacon) {
                var rowClassNames = that.state.isFormActive
                    ? "beacon-row beacon-row-hidden"
                    : "beacon-row";

                return (
                    <div key={ beacon.id } className={ rowClassNames }>
                        <div className="beacon-frame beacon-image-frame">
                            <img src={ beacon.document.profilePictureUrl } className="img-circle" />
                            <h5>{ beacon.document.userName }</h5>
                        </div>

                        <div className="beacon-frame beacon-content-frame">
                            <div className="beacon-content-header">
                                <h3>{ beacon.document.name }</h3>
                            </div>

                            <div className="beacon-content-body">
                                <p>{ beacon.document.message }</p>
                            </div>
                        </div>

                        <div className="beacon-frame beacon-info-frame">
                            <div className="beacon-timestamp">
                                <TimeAgo date={ new Date(beacon.createdAt).toLocaleString('en-US') } />
                            </div>

                            <div className="beacon-attendees-ribbon">
                                <span>{ beacon.document.attendees.length } / { beacon.document.capacity } <i className="fa fa-users fa-2" /></span>
                            </div>

                            <div className="beacon-games-ribbon">
                                { that.gamesRibbonIcons(beacon.document.setups) }
                            </div>
                        </div>
                    </div>
                );
            });
        },

        beaconsMap: function () {
            return (
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
            );
        },

        gamesRibbonIcons: function (setups) {
            var ribbonIcons = [];

            _.each(setups, function (count, game) {
                if (count > 0) {
                    switch(game) {
                        case 'smash64':
                            ribbonIcons.push('/app/img/icon/smash-64-toggle.png');
                            break;

                        case 'melee':
                            ribbonIcons.push('/app/img/icon/melee-toggle.png');
                            break;
                        
                        case 'projectM':
                            ribbonIcons.push('/app/img/icon/project-m-toggle.png');
                            break;
                        
                        case 'sm4sh':
                            ribbonIcons.push('/app/img/icon/sm4sh-toggle.png');
                            break;
                    }
                }
            });
        
            return _.map(ribbonIcons, function (imgUrl) {
                return (
                    <img src={ imgUrl } width="24" height="24" className="beacon-games-ribbon-icon" />
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
