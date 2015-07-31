
module.exports = (function () {
    'use strict';

    var React = require('react');

    var TabControl = React.createClass({

        getInitialState: function () {
            return {
                index: 0
            };
        },

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

                    { this.sectionAtIndex(this.state.index) }
                </div>
            );
        },

        sectionAtIndex: function (i) {
            if (React.Children.count(this.props.children) > 1) {
                return this.props.children[i];
            } else if (React.Children.count(this.props.children) == 1) {
                return i == 0 ? React.Children.only(this.props.children) : null;
            } else {
                return null;
            }
        },

        headerComponents: function () {
            var that = this
              , HeaderComponentTemplate = this.headerComponent;

            return _.map(this.headerComponentProps, function (props, index) {
                var isSelected = index === that.state.index
                  , onClickDelegate = function (event) {
                        that.setState({ index: index });
                    };

                return (
                    <HeaderComponentTemplate
                            isSelected={ isSelected }
                            onClick={ onClickDelegate }
                            {...props} />
                );
            });
        }

    });

    return TabControl;

})();
