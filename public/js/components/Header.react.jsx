
module.exports = (function () {
    'use strict';

    var React = require('react');

    var IconButton = require('./IconButton.react.jsx');

    var Header = React.createClass({

        render: function () {
            var that = this
              , onClickDelegate = function (event) {
                    that.props.toggleMenuButtonAction();
                };

            return (
                <div className="header row">
                    <IconButton
                            layoutColumns="3"
                            iconType="fa-bars"
                            iconSize="fa-3"
                            onClick={ onClickDelegate } />

                    <div className="header-logo col-xs-9 col-sm-9 col-md-9">
                        <h3>Smatchups</h3>
                    </div>
                </div>
            );
        }

    });

    return Header;

})();