
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
        <Module name='BeaconsSection' factory={ module.exports.factory }>
            <Dependency name='Autocomplete' />
            <Dependency name='BeaconForm' />
            <Dependency name='BeaconsResourceActions' />
            <Dependency name='BeaconsStore' />
            <Dependency name='geoPromise' />
            <Dependency name='SetupInputElement' />
            <Dependency name='StoreStateComponentFactory' />
            <Dependency name='ToggleImageButton' />
        </Module>
    );

};

module.exports.factory = function (Autocomplete, BeaconForm,
        BeaconsResourceActions, BeaconsStore, geoPromise, SetupInputElement,
        StoreStateComponentFactory, ToggleImageButton) {
    'use strict';

    /**
     * Packaged dependencies
     */
    var React = require('react');

    // React Bootstrap modules
    var Button = require('react-bootstrap').Button;
    var ButtonGroup = require('react-bootstrap').ButtonGroup;
    var ButtonInput = require('react-bootstrap').ButtonInput;
    var ButtonToolbar = require('react-bootstrap').ButtonToolbar;
    var Col = require('react-bootstrap').Col;
    var Input = require('react-bootstrap').Input;
    var PageHeader = require('react-bootstrap').PageHeader;
    var Panel = require('react-bootstrap').Panel;
    var Row = require('react-bootstrap').Row;

    // React Google Maps modules
    var GoogleMap = require('react-google-maps').GoogleMap;
    var Marker = require('react-google-maps').Marker;
    var SearchBox = require('react-google-maps').SearchBox;

    // React Router modules
    var Link = require('react-router').Link;

    // Other dependencies
    var TimeAgo = require('react-timeago');
    var _ = require('underscore')._;

    var BeaconsSection = React.createClass({

        getInitialState: function () {
            return {
                bounds: null,
                center: { lat: 47.6201451, lng: -122.3298646 },
                currentLocation: null,
                filteredGame: null,
                isFormActive: false,
            };
        },

        componentDidMount: function () {
            var that = this;

            // Trigger a full reload of the BeaconsStore
            BeaconsResourceActions.reloadBeacons();

            geoPromise.getCurrentPosition()
                .then(function (position) {
                    that.setState({
                        center: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        },
                        currentLocation: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        },
                    });
                });
        },

        hideForm: function () {
            this.setState({ isFormActive: false });
        },

        onBoundsChanged: function () {
            this.setState({
                bounds: this.refs.map.getBounds(),
                center: this.refs.map.getCenter(),
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
                    center: places[0].geometry.location,
                });
            }
        },

        onToggledFactory: function (game) {
            var that = this;

            return function (toggleState) {
                var newState = {};

                if (toggleState) {
                    newState.filteredGame = game;
                } else {
                    newState.filteredGame = null;
                }

                that.setState(newState);
            };
        },

        showForm: function ()  {
            this.setState({ isFormActive: true });
        },

        render: function () {
            var createRowClassNames = this.state.isFormActive
                ? 'beacon-row new-beacon-form'
                : 'beacon-row new-beacon-row';

            return (
                <Row className='beacons-section'>
                    <Col xs={ 12 } sm={ 12 } md={ 12 }
                            className='beacons-filters'>
                        { this.beaconsFilters() }
                    </Col>

                    <Col xs={ 6 } sm={ 6 } md={ 6 }
                            className='beacons-list-and-form'>
                        <div key='post-new' className={ createRowClassNames }>
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

                    <Col xs={ 6 } sm={ 6 } md={ 6 }
                            className='beacons-map'
                            data-spy='affix'
                            data-offset-top='58'>
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
                                imageUrl='/app/img/icon/smash-64-toggle.png'
                                imageWidth='24'
                                imageHeight='24'
                                text='Super Smash Bros. 64'
                                toggleState={
                                    this.state.filteredGame === 'smash64'
                                }
                                onToggled={ this.onToggledFactory(
                                    'smash64') } />
                    </ButtonGroup>

                    <ButtonGroup>
                        <ToggleImageButton
                                imageUrl='/app/img/icon/melee-toggle.png'
                                imageWidth='24'
                                imageHeight='24'
                                text='Super Smash Bros. Melee'
                                toggleState={
                                    this.state.filteredGame === 'melee'
                                }
                                onToggled={ this.onToggledFactory(
                                    'melee') } />
                    </ButtonGroup>

                    <ButtonGroup>
                        <ToggleImageButton
                                imageUrl='/app/img/icon/project-m-toggle.png'
                                imageWidth='24'
                                imageHeight='24'
                                text='Project M'
                                toggleState={
                                    this.state.filteredGame === 'projectM'
                                }
                                onToggled={ this.onToggledFactory(
                                    'projectM') } />
                    </ButtonGroup>

                    <ButtonGroup>
                        <ToggleImageButton
                                imageUrl='/app/img/icon/sm4sh-toggle.png'
                                imageWidth='24'
                                imageHeight='24'
                                text='Super Smash Bros. for Wii U'
                                toggleState={
                                    this.state.filteredGame === 'sm4sh'
                                }
                                onToggled={ this.onToggledFactory(
                                    'sm4sh') } />
                    </ButtonGroup>
                </ButtonGroup>
            );
        },

        createBeaconRow: function () {
            return (
                <div onClick={ this.showForm }>
                    <div className='beacon-frame beacon-icon-frame'>
                        <i className='fa fa-plus fa-4' />
                    </div>

                    <div className='beacon-frame beacon-content-frame'>
                        <div className='beacon-content-header'>
                            <h3>Create a new beacon!</h3>
                        </div>

                        <div className='beacon-content-body'>
                            <p>
                                Let your friends know when, where, and what
                                you're playing.
                            </p>
                        </div>
                    </div>
                </div>
            );
        },

        beaconsList: function () {
            var that = this;
            var beacons = _.sortBy(this.props.beacons, function (beacon) {
                return new Date().getTime()
                    - new Date(beacon.createdAt).getTime();
            });

            // Filter down to beacons matching game criteria
            if (this.state.filteredGame) {
                beacons = _.filter(beacons, function (beacon) {
                    return beacon.document.setups[that.state.filteredGame] > 0;
                });
            }

            return _.map(beacons, function (beacon) {
                var rowClassNames = that.state.isFormActive
                    ? 'beacon-row beacon-row-hidden'
                    : 'beacon-row';

                return (
                    <div key={ beacon.id } className={ rowClassNames }>
                        <div className='beacon-frame beacon-image-frame'>
                            <img src={ beacon.document.profilePictureUrl }
                                    className='img-circle' />
                            <h5>{ beacon.document.userName }</h5>
                        </div>

                        <div className='beacon-frame beacon-content-frame'>
                            <div className='beacon-content-header'>
                                <h3>{ beacon.document.name }</h3>
                            </div>

                            <div className='beacon-content-body'>
                                <p>{ beacon.document.message }</p>
                            </div>
                        </div>

                        <div className='beacon-frame beacon-info-frame'>
                            <div className='beacon-timestamp'>
                                <TimeAgo date={
                                    new Date(beacon.createdAt)
                                        .toLocaleString('en-US')
                                } />
                            </div>

                            <div className='beacon-attendees-ribbon'>
                                <span>
                                    { beacon.document.attendees.length } /
                                    { beacon.document.capacity }
                                    <i className='fa fa-users fa-2' />
                                </span>
                            </div>

                            <div className='beacon-games-ribbon'>
                                { that.gamesRibbonIcons(
                                    beacon.document.setups) }
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
                                height: '800px',
                            },
                        } }
                        defaultZoom={ 15 }
                        onBoundsChanged={ this.onBoundsChanged }
                        ref='map'>

                    <SearchBox
                            bounds={ this.state.bounds }
                            classes='google-maps-search-box'
                            controlPosition={
                                google.maps.ControlPosition.TOP_LEFT
                            }
                            onPlacesChanged={ this.onPlacesChanged }
                            ref='searchBox' />

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
                    switch (game) {
                        case 'smash64': {
                            ribbonIcons.push(
                                '/app/img/icon/smash-64-toggle.png');
                            break;
                        }

                        case 'melee': {
                            ribbonIcons.push(
                                '/app/img/icon/melee-toggle.png');
                            break;
                        }

                        case 'projectM': {
                            ribbonIcons.push(
                                '/app/img/icon/project-m-toggle.png');
                            break;
                        }

                        case 'sm4sh': {
                            ribbonIcons.push(
                                '/app/img/icon/sm4sh-toggle.png');
                            break;
                        }
                    }
                }
            });

            return _.map(ribbonIcons, function (imgUrl) {
                return (
                    <img src={ imgUrl }
                            width='24'
                            height='24'
                            className='beacon-games-ribbon-icon' />
                );
            });
        },

    });

    // Mixin StoreStateComponent functionality for the BeaconsStore
    return StoreStateComponentFactory(BeaconsSection, BeaconsStore,
        function (store) {
            return {
                beacons: store.getBeacons(),
            };
        });

};
