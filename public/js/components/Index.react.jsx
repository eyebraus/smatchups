
module.exports = (function () {
    'use strict';

    var React = require('react')
      , Router = require('react-router')
      , RouteHandler = Router.RouteHandler;

    var LinkedIconButton = require('./LinkedIconButton.react.jsx')
      , TabControl = require('./TabControl.react.jsx');

    var Index = React.createClass({

        render: function () {
            return (
                <TabControl
                        headerComponent={ LinkedIconButton }
                        headerComponentProps={ [
                            { iconType: 'fa-gamepad', iconSize: 'fa-3', layoutColumns: '3', routeName: 'beacons' },
                            { iconType: 'fa-calendar', iconSize: 'fa-3', layoutColumns: '3', routeName: 'events' },
                            { iconType: 'fa-users', iconSize: 'fa-3', layoutColumns: '3', routeName: 'buddies' },
                            { iconType: 'fa-user-secret', iconSize: 'fa-3', layoutColumns: '3', routeName: 'challenges' }] }
                        layoutColumns="12">
                    <RouteHandler />
                </TabControl>
            );
        }

    });

    return Index;

})();
