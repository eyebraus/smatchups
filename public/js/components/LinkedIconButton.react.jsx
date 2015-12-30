
module.exports.config = function () {
    'use strict';

    /**
     * Packaged dependencies
     */
    var React = require('react');

    /**
     * Local dependencies
     */
    var Dependency = require('../injector').Dependency;
    var Module = require('../injector').Module;

    return (
        <Module name='LinkedIconButton' factory={ module.exports.factory } />
    );

};

module.exports.factory = function () {
    'use strict';

    /**
     * Packaged dependencies
     */
    var React = require('react');

    // React Router modules
    var Link = require('react-router').Link;

    // Other dependencies
    var _ = require('underscore')._;

    var LinkedIconButton = React.createClass({

        render: function () {
            var iconClassNames = ['fa', this.props.iconType,
                this.props.iconSize].join(' ');

            return (
                <Link to={ this.props.routeName }>
                    <div className='linked-icon-button'>
                        <i className={ iconClassNames } />
                    </div>
                </Link>
            );
        },

    });

    return LinkedIconButton;

};
