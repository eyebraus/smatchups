
module.exports.config = function () {
    'use strict';

    /**
     * npm dependencies
     */
    var React = require('react');

    /**
     * Local dependencies
     */
    var Dependency = require('../injector').Dependency,
        Module = require('../injector').Module;

    return (
        <Module name="Settings" factory={ module.exports.factory } />
    );
};

module.exports.factory = function () {
    'use strict';

    /**
     * npm dependencies
     */
    var React = require('react'),

        // react-bootstrap modules
        Col = require('react-bootstrap').Col,
        Row = require('react-bootstrap').Row,

        // react-router modules
        Router = require('react-router'),
        Link = Router.Link;

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

};
