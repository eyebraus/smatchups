
module.exports = (function () {
    'use strict';

    var React = require('react')
      , GoogleMap = require('react-google-maps').GoogleMap
      , Marker = require('react-google-maps').Marker
      , SearchBox = require('react-google-maps').SearchBox;

    var BeaconsResourceActions = require('../actions/BeaconsResourceActions')
      , BeaconsStore = require('../stores/BeaconsStore')
      , geoPromise = require('../utilities/geoPromise')
      , StoreStateComponentFactory = require('./factories/StoreStateComponent.react.jsx');

    var BeaconsMap = React.createClass({

        getInitialState: function () {
            return {
                bounds: null,
                center: { lat: 47.6201451, lng: -122.3298646 }
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

        render: function () {
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
        }

    });

    // Mixin StoreStateComponent functionality for the BeaconsStore
    return StoreStateComponentFactory(BeaconsMap, BeaconsStore, function (store) {
        return {
            beacons: store.getBeacons()
        };
    });

})();
