
module.exports = (function () {
    'use strict';

    var React = require('react');

    var BeaconsMap = React.createClass({

        getInitialState: function () {
            return {
                beacons: []
            };
        },

        render: function () {
            return (
                <div className="beacon-map row">
                    <h3>Nothing here yet :)</h3>
                </div>
            );
        }

    });

    return BeaconsMap;

})();
