
module.exports = (function () {
    'use strict';

    var React = require('react')
      , Router = require('react-router')
      , Link = Router.Link
      , _ = require('underscore')._;

    var BeaconsList = React.createClass({

        getInitialState: function () {
            return {
                beacons: []
            };
        },

        render: function () {
            return (
                <div className="beacons-list col-xs-12 col-sm-12 col-md-12">
                    { this.beaconRows() }
                </div>
            );
        },

        beaconRows: function () {
            return _.map(this.state.beacons, function (beacon) {
                return (
                    <div className="beacon-row row">
                        <div className="beacon-image-frame col-xs-3 col-sm-3 col-md-3">
                            <img src={ beacon.profilePictureUrl } />
                        </div>

                        <div className="beacon-content-frame col-xs-9 col-sm-9 col-md-9">
                            <div className="beacon-content-header row">
                                <h3>{ beacon.userName }</h3>
                                <img src={ beacon.gameIcon } />
                                <span className="beacon-timestamp">{ beacon.timestamp }</span>
                            </div>

                            <div className="beacon-content-body row">
                                { beacon.message }
                            </div>
                        </div>
                    </div>
                );
            });
        }

    });

    return BeaconsList;

})();
