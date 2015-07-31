
module.exports = (function () {
    'use strict';

    var React = require('react')
      , _ = require('underscore')._;

    var TabControlSection = React.createClass({

        render: function () {
            var that = this;

            // Calculate layoutColumns class names
            var classNames = _.chain(['col-xs-', 'col-sm-', 'col-md-'])
                .map(function (prefix) {
                    return prefix + that.props.layoutColumns;
                })
                .union(['tab-control-section', 'row'])
                .value()
                .join(' ');

            return (
                <div className={ classNames }>
                    { this.props.children }
                </div>
            );
        }

    });

})();
