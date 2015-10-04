
module.exports = (function () {
    'use strict';

    var React = require('react')
      , Button = require('react-bootstrap').Button
      , _ = require('underscore')._;

    var ToggleImageButton = React.createClass({

        render: function () {
            var that = this
              , divClasses = ['toggle-image-button']
              , imgClassNames = [this.props.toggleState ? 'enabled' : 'disabled'].join(' ');

            // Add any user-specified classes
            if (_.contains(_.keys(this.props), 'classes')) {
                divClasses = _.chain(this.props.classes)
                    .union(divClasses)
                    .value();
            }

            var divClassNames = divClasses.join(' ');

            return (
                <Button>
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

})();
