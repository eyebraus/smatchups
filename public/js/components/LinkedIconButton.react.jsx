
module.exports = (function () {
    'use strict';

    var React = require('react')
      , Link = require('react-router').Link
      , _ = require('underscore')._;

    var LinkedIconButton = React.createClass({

        render: function () {
            var that = this
              , divClasses = ['linked-icon-button']
              , iconClassNames = ['fa', this.props.iconType, this.props.iconSize].join(' ');

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
                <Link to={ this.props.routeName }>
                    <div className={ divClassNames }>
                        <i className={ iconClassNames } />
                    </div>
                </Link>
            );
        }

    });

    return LinkedIconButton;

})();
