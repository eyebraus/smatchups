
/**
 * React component: toggle button containing a small image icon along with some
 * text.
 *
 * @module components/ToggleImageButton
 */

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
        <Module name='ToggleImageButton' factory={ module.exports.factory } />
    );

};

module.exports.factory = function () {
    'use strict';

    /**
     * Packaged dependencies
     */
    var React = require('react');

    // React Bootstrap modules
    var Button = require('react-bootstrap').Button;

    // Other dependencies
    var _ = require('underscore')._;

    var ToggleImageButton = React.createClass({

        /**
         * Generates DOM subtree based on current properties and state.
         *
         * @returns {Object} Current DOM representation of component
         */

        render: function () {
            var that = this;
            var buttonClasses = [];
            var toggleClassName = this.props.toggleState
                ? 'enabled'
                : 'disabled';
            var imgClassNames = [toggleClassName].join(' ');

            // Add active state if button is toggled
            if (this.props.toggleState) {
                buttonClasses.push('active');
            }

            // Add any user-specified classes
            if (_.contains(_.keys(this.props), 'classes')) {
                buttonClasses = _.chain(this.props.classes)
                    .union(buttonClasses)
                    .value();
            }

            var buttonClasses = buttonClasses.join(' ');

            return (
                <Button className={ buttonClasses } onClick={ this.onClick }>
                    <img src={ this.props.imageUrl }
                            width={ this.props.imageWidth }
                            height={ this.props.imageHeight }
                            className={ imgClassNames } /> { this.props.text }
                </Button>
            );
        },

        onClick: function (event) {
            var toggleState = !this.props.toggleState;

            return this.props.onToggled(toggleState);
        },

    });

    return ToggleImageButton;

};
