
module.exports = (function () {
    'use strict';

    var React = require('react');

    var BeaconFeedRow = React.createClass({

        render: function () {
            return (
                <div className="feed-section-row row">
                    <div className="beacon-image-frame col-xs-3 col-sm-3 col-md-3">
                        <img src={ this.props.beacon.profilePictureUrl } />
                    </div>

                    <div className="beacon-content-frame col-xs-9 col-sm-9 col-md-9">
                        <div className="beacon-content-header row">
                            <h3>{ this.props.beacon.userName }</h3>
                            <img src={ this.props.beacon.gameIcon } />
                            <span className="beacon-timestamp">{ this.props.beacon.timestamp }</span>
                        </div>

                        <div className="beacon-content-body row">
                            { this.props.beacon.message }
                        </div>
                    </div>
                </div>
            );
        }

    });

    var BeaconFeedSection = React.createClass({

        render: function () {
            return (
                <div className="feed-section row">
                    <div className="feed-section-rows-wrapper col-xs-12 col-sm-12 col-md-12">
                        { this.beaconFeedRows() }
                    </div>

                    <div className="feed-section-toggle-mode col-xs-12 col-sm-12 col-md-12">
                        <div className="feed-section-toggle-icon toggle-icon-disabled col-xs-6 col-sm-6 col-md-6">
                            <i className="fa fa-list fa-3" />
                        </div>

                        <div className="feed-section-toggle-icon toggle-icon-disabled col-xs-6 col-sm-6 col-md-6">
                            <i className="fa fa-globe fa-3" />
                        </div>
                    </div>
                </div>
            );
        },

        beaconFeedRows: function () {
            return this.props.beacons.map(function (beacon) {
                return (
                    <BeaconFeedRow
                            beacon={ beacon } />
                );
            });
        }

    });

    return BeaconFeedSection;

})();
