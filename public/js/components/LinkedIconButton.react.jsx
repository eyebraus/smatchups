
module.exports.config = function () {
    'use strict';

    /**
     * Local dependencies
     */
    var Dependency = require('./injector').Dependency
      , Module = require('./injector').Module
        ;

    return (
        <Module name="LinkedIconButton" factory={ module.exports.factory } />
    );
};

module.exports.factory = function () {
    'use strict';

    /**
     * npm dependencies
     */
    var React = require('react')

    // react-router modules
      , Link = require('react-router').Link

    // others
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

};
