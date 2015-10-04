
module.exports = (function () {
    'use strict';

    var React = require('react')
      , Col = require('react-bootstrap').Col
      , Row = require('react-bootstrap').Row
      , Router = require('react-router')
      , Link = Router.Link;

    var Settings = React.createClass({

        render: function () {
            return (
                <Row>
                    <Col className="settings-menu" xs={ 12 } sm={ 12 } md={ 12 }>
                        <h3>Nothing here yet :)</h3>
                    </Col>
                </Row>
            );
        }

    });

    return Settings;

})();
