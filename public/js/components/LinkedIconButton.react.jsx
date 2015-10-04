
module.exports = (function () {
    'use strict';

    var React = require('react')
      , Link = require('react-router').Link
      , _ = require('underscore')._;

    var LinkedIconButton = React.createClass({

        render: function () {
            var iconClassNames = ['fa', this.props.iconType, this.props.iconSize].join(' ');

            return (
                <Link to={ this.props.routeName }>
                    <div className="linked-icon-button">
                        <i className={ iconClassNames } />
                    </div>
                </Link>
            );
        }

    });

    return LinkedIconButton;

})();
