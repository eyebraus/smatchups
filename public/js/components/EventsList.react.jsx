
module.exports = (function () {
    'use strict';

    var React = require('react')
      , Row = require('react-bootstrap').Row;

    var EventsList = React.createClass({

        render: function () {
            return (
                <Row className="events-list">
                    <h3>Nothing here yet :)</h3>
                </Row>
            );
        }

    });

    return EventsList;

})();
