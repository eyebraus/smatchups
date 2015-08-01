
module.exports = (function () {
    'use strict';

    var React = require('react')
      , _ = require('underscore')._;

    var IconButton = React.createClass({

        render: function () {
            var that = this
              , divClasses = _.chain(['col-xs-', 'col-sm-', 'col-md-'])
                    .map(function (prefix) {
                        return prefix + that.props.layoutColumns;
                    })
                    .union(['menu-button'])
                    .value()
              , iconClassNames = ['fa', this.props.iconType, this.props.iconSize].join(' ');

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
                    <i className={ iconClassNames } />
                </div>
            );
        },

        onClick: function (event) {
            return this.props.onClick(event);
        }

    });

    return IconButton;

})();
