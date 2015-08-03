
module.exports = (function () {
    'use strict';

    var React = require('react')
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

            // Add any layout classes
            if (_.contains(_.keys(this.props), 'layoutColumns')) {
                divClasses = _.chain(['col-xs-', 'col-sm-', 'col-md-'])
                    .map(function (prefix) {
                        return prefix + that.props.layoutColumns;
                    })
                    .union(divClasses)
                    .value();
            }

            if (_.contains(_.keys(this.props), 'layoutOffset')) {
                divClasses = _.chain(['col-xs-offset-', 'col-sm-offset-', 'col-md-offset-'])
                    .map(function (prefix) {
                        return prefix + that.props.layoutOffset;
                    })
                    .union(divClasses)
                    .value();
            }

            var divClassNames = divClasses.join(' ');

            return (
                <div className={ divClassNames }>
                    <img src={ this.props.iconUrl } className={ imgClassNames } />
                </div>
            );
        },

        onClick: function (event) {
            var toggleState = !this.props.toggleState;

            return this.props.onToggled(toggleState);
        }

    });

    return ToggleImageButton;

})();
