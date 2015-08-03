
module.exports = (function () {
    'use strict';

    var React = require('react')
      , Link = require('react-router').Link
      , _ = require('underscore')._;

    var TabControl = React.createClass({

        render: function () {
            var that = this;

            // Calculate layoutColumns class names:w
            var classNames = _.chain(['col-xs-', 'col-sm-', 'col-md-'])
                .map(function (prefix) {
                    return prefix + that.props.layoutColumns;
                })
                .union(['tab-control'])
                .value()
                .join(' ');

            return (
                <div className={ classNames }>
                    <div className="tab-control-header row">
                        { this.headerComponents() }
                    </div>

                    { this.props.children }
                </div>
            );
        },

        headerComponents: function () {
            var that = this
              , HeaderComponentTemplate = this.headerComponent;

            return _.map(this.headerComponentProps, function (props, index) {
                return (
                    <HeaderComponentTemplate {...props} />
                );
            });
        }

    });

    return TabControl;

})();
