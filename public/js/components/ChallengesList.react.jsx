
module.exports = (function () {
    'use strict';

    var React = require('react')
      , Row = require('react-bootstrap').Row;

    var ChallengesList = React.createClass({

        render: function () {
            return (
                <Row className="challenges-list">
                    <h3>Nothing here yet :)</h3>
                </Row>
            );
        }

    });

    return ChallengesList;

})();
