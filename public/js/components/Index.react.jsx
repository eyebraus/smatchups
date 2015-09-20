
module.exports = (function () {
    'use strict';

    var React = require('react')
      , Col = require('react-bootstrap').Col
      , Row = require('react-bootstrap').Row
      , Router = require('react-router')
      , RouteHandler = Router.RouteHandler;

    var LinkedIconButton = require('./LinkedIconButton.react.jsx')
      , TabControl = require('./TabControl.react.jsx');

    var Index = React.createClass({

        render: function () {
            return (
                <Row>
                    <Col xs={ 12 } sm={ 12 } md={ 12 }>
                        <TabControl
                                headerComponent={ LinkedIconButton }
                                headerComponentProps={ [
                                    { iconType: 'fa-gamepad', iconSize: 'fa-3', routeName: 'beacons' },
                                    { iconType: 'fa-calendar', iconSize: 'fa-3', routeName: 'events' },
                                    { iconType: 'fa-users', iconSize: 'fa-3', routeName: 'buddies' },
                                    { iconType: 'fa-user-secret', iconSize: 'fa-3', routeName: 'challenges' }] }
                                iconColSize={ 3 }>
                            <RouteHandler />
                        </TabControl>
                    </Col>
                </Row>
            );
        }

    });

    return Index;

})();
