
module.exports = (function () {
    'use strict';

    var React = require('react')
      , Col = require('react-bootstrap').Col
      , Grid = require('react-bootstrap').Grid
      , PageHeader = require('react-bootstrap').PageHeader
      , Row = require('react-bootstrap').Row
      , Router = require('react-router')
      , Navigation = Router.Navigation
      , RouteHandler = Router.RouteHandler;

    var LinkedIconButton = require('./LinkedIconButton.react.jsx');

    var SmatchupsApp = React.createClass({

        mixins: [Navigation],

        getInitialState: function () {
            return {};
        },

        componentDidMount: function () {
            // Hacky: force a "DefaultRoute" in code-behind so page isn't blank
            this.replaceWith('beacons');
        },

        render: function () {
            return (
                <Grid>
                    <Row className="header">
                        <Col xs={ 3 } sm={ 3 } md={ 3 }>
                            <LinkedIconButton
                                    iconType="fa-bars"
                                    iconSize="fa-3"
                                    routeName="settings" />
                        </Col>

                        <Col xs={ 9 } sm={ 9 } md={ 9 } className="header-logo">
                            <PageHeader>Smatchups</PageHeader>
                        </Col>
                    </Row>

                    <RouteHandler />
                </Grid>
            );
        }

    });

    return SmatchupsApp;

})();
