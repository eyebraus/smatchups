
module.exports = (function () {
    'use strict';

    var React = require('react')
      , Router = require('react-router')
      , Link = Router.Link;

    var Settings = React.createClass({

        render: function () {
            return (
                <div className="settings-menu col-xs-12 col-sm-12 col-md-12">
                    <h3>Nothing here yet :)</h3>
                </div>
            );
        }

    });

    return Settings;

})();
