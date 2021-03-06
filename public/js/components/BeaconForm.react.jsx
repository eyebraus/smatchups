
/**
 * React component: form that users can fill out to create a new beacon.
 *
 * @module components/BeaconForm
 */

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
        <Module name='BeaconForm' factory={ module.exports.factory }>
            <Dependency name='Autocomplete' />
            <Dependency name='geoPromise' />
            <Dependency name='SetupInputElement' />
        </Module>
    );

};

module.exports.factory = function (Autocomplete, geoPromise,
        SetupInputElement) {
    'use strict';

    /**
     * Packaged dependencies
     */
    var React = require('react');

    // React Bootstrap
    var Button = require('react-bootstrap').Button;
    var ButtonInput = require('react-bootstrap').ButtonInput;
    var Input = require('react-bootstrap').Input;
    var Panel = require('react-bootstrap').Panel;

    // Other dependencies
    var _ = require('underscore')._;

    var BeaconForm = React.createClass({

        /**
         * Creates initial component state.
         *
         * @returns {Object} Initial component state
         */

        getInitialState: function () {
            return {
                address: {},
                capacity: 0,
                expiresInMinutes: 30,
                location: {},
                locationString: '',
                message: '',
                name: '',
                setupCountSmash64: 0,
                setupCountMelee: 0,
                setupCountProjectM: 0,
                setupCountSm4sh: 0,
                visibility: 'locals',
            };
        },

        /**
         * Event handler, fired when the Autocomplete component's place is
         * changed.
         *
         * @param {Object} place - new place object; see the PlaceResult entry
         *      at the {@link https://developers.google.com/maps/|Google Maps}
         *      API reference for more info about this object.
         */

        onAutocompleteChanged: function (place) {
            var newState = {};
            newState.locationString = place.name;

            if (place.geometry && place.geometry.location) {
                newState.location = place.geometry.location;
            }

            // JSCS Exception: Google's APIs use low_dashed identifiers
            // rather than camelCased or UPPER_CASED ones.
            // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
            if (place.address_components) {
                newState.address = {
                    number: (place.address_components[0]
                        && place.address_components[0].long_name
                        || ''),
                    street: (place.address_components[1]
                        && place.address_components[1].long_name
                        || ''),
                    city: (place.address_components[2]
                        && place.address_components[2].long_name
                        || ''),
                    state: (place.address_components[3]
                        && place.address_components[3].long_name
                        || ''),
                    country: (place.address_components[4]
                        && place.address_components[4].long_name
                        || ''),
                    zipCode: (place.address_components[5]
                        && place.address_components[5].long_name
                        || ''),
                };
            }
            // jscs:enable requireCamelCaseOrUpperCaseIdentifiers

            this.setState(newState);
        },

        /**
         * Event handler factory. Fired when a numeric or string form input is
         * updated.
         *
         * @param {string} keyName - name of state member to set
         * @returns {function} Event handler for a value change on a string or
         *      numeric form element
         */

        onChangeFactory: function (keyName) {
            var that = this;

            return function (event) {
                var newState = {};
                newState[keyName] = event.target.value;

                that.setState(newState);
            };
        },

        /**
         * Event handler factory. Fired when a checkbox form input is updated.
         *
         * @param {string} enumValue - value to set state enum to when checkbox
         *      checked.
         * @returns {function} Event handler for a checkbox checked event
         */

        onCheckedFactory: function (enumValue) {
            var that = this;

            return function (event) {
                that.setState({
                    visibility: enumValue,
                });
            };
        },

        /**
         * Event handler, fired when form or sub-element receives a keystroke.
         * The primary purpose is to prevent form submission on pressing enter
         * inside the Autocomplete.
         *
         * @param {Object} event - event instance payload; contains information
         *      about which key was pressed.
         */

        onKeyPress: function (event) {
            if (event.which === 13) {
                event.preventDefault();
            }
        },

        /**
         * Event handler, fired when the form is submitted. Suppresses the
         * default form submission behavior, and performs the action received
         * via props.
         *
         * @param {Object} event - event instance payload
         */

        onSubmit: function (event) {
            // Block normal event propagation
            event.preventDefault();

            this.props.onSubmit(_.clone(this.state));
        },

        /**
         * Generates DOM subtree based on current properties and state.
         *
         * @returns {Object} Current DOM representation of component
         */

        render: function () {
            return (
                <form className='beacon-form'
                        onKeyPress={ this.onKeyPress }
                        onSubmit={ this.onSubmit }>
                    <Input name='beacon-name'
                            label='Friendly name:'
                            placeholder='Give your fest a memorable title!'
                            type='text'
                            value={ this.state.name }
                            onChange={ this.onChangeFactory('name') } />

                    <Autocomplete
                            bounds={ this.props.bounds }
                            name='beacon-location'
                            label='Location:'
                            placeholder='e.g. Folsom Street Foundry'
                            type='text'
                            value={ this.state.locationString }
                            onChange={ this.onChangeFactory('locationString') }
                            onPlaceChanged={ this.onAutocompleteChanged } />

                    <div className='form-group setups-form-group'>
                        <label>Setups:</label>

                        <SetupInputElement
                                imageUrl='/app/img/icon/smash-64-toggle.png'
                                name='smash-64-setup-input'
                                value={ this.state.setupCountSmash64 }
                                onChange={ this.onChangeFactory(
                                    'setupCountSmash64') } />
                        <SetupInputElement
                                imageUrl='/app/img/icon/melee-toggle.png'
                                name='melee-setup-input'
                                value={ this.state.setupCountMelee }
                                onChange={ this.onChangeFactory(
                                    'setupCountMelee') } />
                        <SetupInputElement
                                imageUrl='/app/img/icon/project-m-toggle.png'
                                name='project-m-setup-input'
                                value={ this.state.setupCountProjectM }
                                onChange={ this.onChangeFactory(
                                    'setupCountProjectM') } />
                        <SetupInputElement
                                imageUrl='/app/img/icon/sm4sh-toggle.png'
                                name='sm4sh-setup-input'
                                value={ this.state.setupCountSm4sh }
                                onChange={ this.onChangeFactory(
                                    'setupCountSm4sh') } />

                        <Panel bsStyle='warning'>
                            Please only report full setups. For example, if you
                            have a GameCube, but no CRT, don't report a full
                            Melee setup.
                        </Panel>
                    </div>

                    <Input name='capacity-number'
                            label='How many players can you host?'
                            type='number'
                            value={ this.state.capacity }
                            onChange={ this.onChangeFactory('capacity') }
                            min='0'
                            step='1' />

                    <p className='help-block'>
                        Note: a capacity of 0 indicates no desired capacity.
                    </p>

                    <Input name='expires-in-minutes-number'
                            label='How many minutes should this beacon stay up?'
                            type='number'
                            value={ this.state.expiresInMinutes }
                            onChange={ this.onChangeFactory(
                                'expiresInMinutes') }
                            min='0'
                            max='60'
                            step='1' />

                    <div className='form-group'>
                        <label>Who can see and respond to your beacon?</label>

                        <Input name='visibility-radio'
                                label='All players'
                                type='radio'
                                checked={ this.state.visibility === 'public' }
                                onChange={ this.onCheckedFactory('public') } />
                        <Input name='visibility-radio'
                                label='Nearby players & buddies'
                                type='radio'
                                checked={ this.state.visibility === 'locals' }
                                onChange={ this.onCheckedFactory('locals') } />
                        <Input name='visibility-radio'
                                label='Buddies only'
                                type='radio'
                                checked={ this.state.visibility === 'buddies' }
                                onChange={ this.onCheckedFactory('buddies') } />
                    </div>

                    <Input name='message-textarea'
                            type='textarea'
                            value={ this.state.message }
                            onChange={ this.onChangeFactory('message') }
                            placeholder='Leave a message for other players...'
                            />

                    <div className='form-group create-beacon-buttons'>
                        <ButtonInput name='cancel-button'
                                type='button'
                                className='btn btn-default'
                                onClick={ this.props.onCancel }>
                            Cancel
                        </ButtonInput>

                        <ButtonInput name='submit-button'
                                type='submit'
                                className='btn btn-primary'>
                            Submit
                        </ButtonInput>
                    </div>
                </form>
            );
        },

    });

    return BeaconForm;

};
