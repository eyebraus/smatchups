
module.exports = (function () {
    'use strict';

    var React = require('react');

    var TabControlIconHeader = React.createClass({

        render: function () {
            var iconClassNames = ['fa', this.props.iconType, this.props.iconSize].join(' ')
              , divClassNames = ['tab-control-icon-header',
                    this.props.isSelected ? 'tab-control-icon-selected' : 'tab-control-icon-unselected']
                    .join(' ');

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

    return TabControlIconHeader;

})();
