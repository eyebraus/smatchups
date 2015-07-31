
module.exports = (function () {
    'use strict';

    var React = require('react');

    var HeaderMenuButton = React.createClass({

        render: function () {
            return (
                <div className="header-menu-button col-xs-3 col-sm-3 col-md-3">
                    <i className="fa fa-bars fa-3" />
                </div>
            );
        },

        onClick: function (event) {
            return this.props.onClick(event);
        }

    });

    var Header = React.createClass({

        render: function () {
            var that = this
              , onClickDelegate = function (event) {
                    that.props.toggleMenuButtonAction();
                };

            return (
                <div className="header row">
                    <HeaderMenuButton
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