
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
                capacity: 0,
                center: { lat: 47.6201451, lng: -122.3298646 },
                currentLocation: null,
                expiresInMinutes: 30,
                formAddress: {},
                formLocationValue: '',
                isFormActive: false,
                isSmash64Enabled: false,
                isMeleeEnabled: true,
                isProjectMEnabled: false,
                isSm4shEnabled: false,
                location: null,
                message: '',
                name: '',
                setupCountSmash64: 0,
                setupCountMelee: 0,
                setupCountProjectM: 0,
                setupCountSm4sh: 0,
                visibility: 'locals'
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

        onAutocompleteChanged: function (place) {
            var newState = {};
            newState.formLocationValue = place.name;

            if (place.address_components) {
                newState.formAddress = {
                    number: (place.address_components[0] && place.address_components[0].long_name || ''),
                    street: (place.address_components[1] && place.address_components[1].long_name || ''),
                    city: (place.address_components[2] && place.address_components[2].long_name || ''),
                    state: (place.address_components[3] && place.address_components[3].long_name || ''),
                    country: (place.address_components[4] && place.address_components[4].long_name || ''),
                    zipCode: (place.address_components[5] && place.address_components[5].long_name || '')
                };
            }

            this.setState(newState);
        },

        onBoundsChanged: function () {
            this.setState({
                bounds: this.refs.map.getBounds(),
                center: this.refs.map.getCenter()
            });
        },

        onChangeFactory: function (keyName) {
            var that = this;

            return function (event) {
                var newState = {};
                newState[keyName] = event.target.value;

                that.setState(newState);
            };
        },

        onCheckedFactory: function (enumValue) {
            var that = this;

            return function (event) {
                that.setState({
                    visibility: enumValue
                });
            };
        },

        onKeyPress: function (event) {
            // Prevents Google Maps keypresses from submitting the form
            if (event.which === 13) {
                event.preventDefault();
            }
        },

        onPlacesChanged: function () {
            var places = this.refs.searchBox.getPlaces();

            if (places.length > 0) {
                this.setState({
                    center: places[0].geometry.location
                });
            }
        },

        onSubmit: function (event) {
            var that = this;

            // Block normal event propagation
            event.preventDefault();

            var beacon = {
                entryFee: this.state.entryFee,
                games: this.state.games,
                isSmash64Checked: this.state.isSmash64Checked,
                isMeleeChecked: this.state.isMeleeChecked,
                isProjectMChecked: this.state.isProjectMChecked,
                isSm4shChecked: this.state.isSm4shChecked,
                location: this.state.location,
                message: this.state.message
            };

            BeaconsResourceActions.createBeaconFromForm(beacon)
                .then(function () {
                    that.hideForm();
                });
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
                                ? this.createBeaconForm()
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

        createBeaconForm: function () {
            return (
                <form className="beacon-form" onKeyPress={ this.onKeyPress } onSubmit={ this.onSubmit }>
                    <Input name="beacon-name"
                            label="Friendly name:"
                            placeholder="Give your fest a memorable title!"
                            type="text"
                            value={ this.state.name }
                            onChange={ this.onChangeFactory('name') } />

                    <Autocomplete
                            bounds={ this.state.bounds }
                            name="beacon-location"
                            label="Location:"
                            placeholder="e.g. Folsom Street Foundry"
                            type="text"
                            value={ this.state.formLocationValue }
                            onChange={ this.onChangeFactory('formLocationValue') }
                            onPlaceChanged={ this.onAutocompleteChanged } />

                    <div className="form-group setups-form-group">
                        <label>Setups:</label>

                        <SetupInputElement
                                imageUrl="/app/img/icon/smash-64-toggle.png"
                                name="smash-64-setup-input"
                                value={ this.state.setupCountSmash64 }
                                onChange={ this.onChangeFactory('setupCountSmash64') } />
                        <SetupInputElement
                                imageUrl="/app/img/icon/melee-toggle.png"
                                name="melee-setup-input"
                                value={ this.state.setupCountMelee }
                                onChange={ this.onChangeFactory('setupCountMelee') } />
                        <SetupInputElement
                                imageUrl="/app/img/icon/project-m-toggle.png"
                                name="project-m-setup-input"
                                value={ this.state.setupCountProjectM }
                                onChange={ this.onChangeFactory('setupCountProjectM') } />
                        <SetupInputElement
                                imageUrl="/app/img/icon/sm4sh-toggle.png"
                                name="sm4sh-setup-input"
                                value={ this.state.setupCountSm4sh }
                                onChange={ this.onChangeFactory('setupCountSm4sh') } />

                        <Panel bsStyle="warning">
                            Please only report full setups. For example, if you have a GameCube, but no CRT, don't report a full Melee setup.
                        </Panel>
                    </div>

                    <Input name="capacity-number"
                            label="How many players can you host?"
                            type="number"
                            value={ this.state.capacity }
                            onChange={ this.onChangeFactory('capacity') }
                            min="0"
                            step="1" />

                    <p className="help-block">Note: a capacity of 0 indicates no desired capacity.</p>

                    <Input name="expires-in-minutes-number"
                            label="How many minutes should this beacon stay up?"
                            type="number"
                            value={ this.state.expiresInMinutes }
                            onChange={ this.onChangeFactory('expiresInMinutes') }
                            min="0"
                            max="60"
                            step="1" />

                    <div className="form-group">
                        <label>Who can see and respond to your beacon?</label>

                        <Input name="visibility-radio"
                                label="All players"
                                type="radio"
                                checked={ this.state.visibility === 'public' }
                                onChange={ this.onCheckedFactory('public') } />
                        <Input name="visibility-radio"
                                label="Nearby players & buddies"
                                type="radio"
                                checked={ this.state.visibility === 'locals' }
                                onChange={ this.onCheckedFactory('locals') } />
                        <Input name="visibility-radio"
                                label="Buddies only"
                                type="radio"
                                checked={ this.state.visibility === 'buddies' }
                                onChange={ this.onCheckedFactory('buddies') } />
                    </div>

                    <Input name="message-textarea"
                            type="textarea"
                            value={ this.state.message }
                            onChange={ this.onChangeFactory('message') }
                            placeholder="Leave a message for other players..." />

                    <div className="form-group create-beacon-buttons">
                        <ButtonInput name="cancel-button" type="button" className="btn btn-default" onClick={ this.hideForm }>Cancel</ButtonInput>
                        <ButtonInput name="submit-button" type="submit" className="btn btn-primary">Submit</ButtonInput>
                    </div>
                </form>
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
                            <h4>Create a new beacon!</h4>
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
