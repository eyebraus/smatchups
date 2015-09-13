
module.exports = (function () {
    'use strict';

    var React = require('react')
      , GoogleMap = require('react-google-maps').GoogleMap
      , Marker = require('react-google-maps').Marker
      , SearchBox = require('react-google-maps').SearchBox
      , Router = require('react-router')
      , Link = Router.Link
      , _ = require('underscore')._;

    var BeaconsResourceActions = require('../actions/BeaconsResourceActions')
      , geoPromise = require('../utilities/geoPromise');

    var GameSelectFormElement = React.createClass({

        render: function () {
            return (
                <div className="game-select-form-element">
                    <input type="checkbox" name={ this.props.name } checked={ this.props.isChecked } onChange={ this.props.onChange } />
                    <label htmlFor={ this.props.name }>{ this.props.label }</label>
                </div>
            );
        }

    });

    var CreateBeacon = React.createClass({

        mixins: [Router.Navigation],

        getInitialState: function () {
            return {
                bounds: null,
                center: { lat: 47.6201451, lng: -122.3298646 },
                currentLocation: null,
                entryFee: 0,
                games: [],
                isSmash64Checked: false,
                isMeleeChecked: false,
                isProjectMChecked: false,
                isSm4shChecked: false,
                location: null,
                message: ''
            };
        },

        componentDidMount: function () {
            var that = this;

            geoPromise.getCurrentPosition()
                .then(function (position) {
                    var geo = { lat: position.coords.latitude, lng: position.coords.longitude };

                    that.setState({
                        center: geo,
                        currentLocation: geo
                    });
                });
        },

        onBoundsChanged: function () {
            this.setState({
                bounds: this.refs.map.getBounds(),
                center: this.refs.map.getCenter()
            });
        },

        onCancel: function () {
            this.goBack();
        },

        onChangeFactory: function (keyName) {
            var that = this;

            return function (event) {
                var newState = {};
                newState[keyName] = event.target.value;

                that.setState(newState);
            };
        },

        onCheckedFactory: function (keyName) {
            var that = this;

            return function (event) {
                var newState = {};
                newState[keyName] = event.target.checked;
                newState.games = that.state.games;

                var flagToGameMap = {
                    'isSmash64Checked': 'smash64',
                    'isMeleeChecked': 'melee',
                    'isProjectMChecked': 'projectM',
                    'isSm4shChecked': 'sm4sh'
                };

                if (event.target.checked) {
                    newState.games = _.union(newState.games, [flagToGameMap[keyName]]);
                } else {
                    newState.games = _.without(newState.games, flagToGameMap[keyName]);
                }

                that.setState(newState);
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
                    center: places[0].geometry.location,
                    location: places[0].geometry.location
                });
            }
        },

        onSubmit: function (event) {
            var that = this;

            // Block normal event propagation
            event.preventDefault();

            BeaconsResourceActions.createBeaconFromForm(_.clone(this.state))
                .then(function () {
                    that.goBack();
                });
        },

        render: function () {
            return (
                <form className="beacon-form col-xs-12 col-sm-12 col-md-12" onKeyPress={ this.onKeyPress } onSubmit={ this.onSubmit }>
                    <div className="form-group">
                        <fieldset>
                            <legend>What games are you playing?</legend>

                            <GameSelectFormElement
                                    name="smash-64-checkbox"
                                    label="SSB 64"
                                    isChecked={ this.state.isSmash64Checked }
                                    onChange={ this.onCheckedFactory('isSmash64Checked') } />
                            <GameSelectFormElement
                                    name="melee-checkbox"
                                    label="SSB Melee"
                                    isChecked={ this.state.isMeleeChecked }
                                    onChange={ this.onCheckedFactory('isMeleeChecked') } />
                            <GameSelectFormElement
                                    name="project-m-checkbox"
                                    label="Project M"
                                    isChecked={ this.state.isProjectMChecked }
                                    onChange={ this.onCheckedFactory('isProjectMChecked') } />
                            <GameSelectFormElement
                                    name="sm4sh-checkbox"
                                    label="SSB for Wii U"
                                    isChecked={ this.state.isSm4shChecked }
                                    onChange={ this.onCheckedFactory('isSm4shChecked') } />
                        </fieldset>
                    </div>

                    <div className="form-group">
                        <label htmlFor="entry-fee-number">Entry fee:</label>
                        <input name="entry-fee-number"
                                type="number"
                                value={ this.state.entryFee }
                                onChange={ this.onChangeFactory('entryFee') }
                                min="0"
                                max="10"
                                step="1" />
                    </div>

                    <div className="form-group">
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

                            { null !== this.state.location
                                ? <Marker position={ this.state.location } />
                                : <noscript /> }

                        </GoogleMap>
                    </div>

                    <div className="form-group">
                        <textarea name="message-textarea"
                                value={ this.state.message }
                                onChange={ this.onChangeFactory('message') }
                                placeholder="Leave a message for other players..." />
                    </div>

                    <div className="form-group">
                        <button name="submit-button" type="submit" className="btn btn-primary">Submit</button>
                        <button name="cancel-button" type="button" className="btn btn-default" onClick={ this.onCancel }>Cancel</button>
                    </div>
                </form>
            );
        }

    });

    return CreateBeacon;

})();
