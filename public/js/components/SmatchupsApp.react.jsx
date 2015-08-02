
module.exports = (function () {
    'use strict';

    var React = require('react')
      , Router = require('react-router')
      , RouteHandler = Router.RouteHandler;

    var LinkedIconButton = require('./LinkedIconButton.react.jsx');

    var SmatchupsApp = React.createClass({

        getInitialState: function () {
            return {};
        },

        render: function () {
            return (
                <div className="smatchups-app container">
                    <div className="header row">
                        <LinkedIconButton
                                iconType="fa-bars"
                                iconSize="fa-3"
                                layoutColumns="3"
                                routeName="search" />

                        <div className="header-logo col-xs-9 col-sm-9 col-md-9">
                            <h3>Smatchups</h3>
                        </div>
                    </div>

                    <RouteHandler />
                </div>
            );
        }

    });

    return SmatchupsApp;

})();
