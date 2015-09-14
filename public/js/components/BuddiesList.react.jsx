
module.exports = (function () {
    'use strict';

    var React = require('react')
      , Row = require('react-bootstrap').Row;

    var BuddiesList = React.createClass({

        render: function () {
            return (
                <Row className="buddies-list">
                    <h3>Nothing here yet :)</h3>
                </Row>
            );
        }

    });

    return BuddiesList;

})();
