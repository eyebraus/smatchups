
module.exports.config = function () {
    'use strict';

    /**
     * Local dependencies
     */
    var Dependency = require('./injector').Dependency
      , Module = require('./injector').Module
        ;

    return (
        <Module name="ToggleImageButton" factory={ module.exports.factory } />
    );
};

module.exports.factory = function () {
    'use strict';

    /**
     * npm dependencies
     */
    var React = require('react')

    // react-bootstrap modules
      , Button = require('react-bootstrap').Button

    // other modules
      , _ = require('underscore')._;

    var ToggleImageButton = React.createClass({

        render: function () {
            var that = this
              , buttonClasses = []
              , imgClassNames = [this.props.toggleState ? 'enabled' : 'disabled'].join(' ');

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
                    <img src={ this.props.imageUrl } width={ this.props.imageWidth } height={ this.props.imageHeight } className={ imgClassNames } /> { this.props.text }
                </Button>
            );
        },

        onClick: function (event) {
            var toggleState = !this.props.toggleState;

            return this.props.onToggled(toggleState);
        }

    });

    return ToggleImageButton;

};
