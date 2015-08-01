
module.exports = (function () {
    'use strict';

    var React = require('react');

    var IconButton = require('./IconButton.react.jsx');

    var BeaconGameFilterToggleButton = React.createClass({

        render: function () {
            var imgClassNames = [this.props.isEnabled ? 'filters-icon-enabled' : 'filters-icon-disabled'].join(' ');

            return (
                <div className="filters-section-toggle-icon col-xs-2 col-sm-2 col-md-2">
                    <img src={ this.props.iconUrl } className={ imgClassNames } />
                </div>
            );
        },

        onClick: function (event) {
            return this.props.onClick(event);
        }

    });

    var BeaconFiltersSection = React.createClass({

        getInitialState: function () {
            return {
                isSmash64Enabled: false,
                isMeleeEnabled: true,
                isProjectMEnabled: false,
                isSm4shEnabled: false
            };
        },

        render: function () {
            var that = this
              , toggleButtonFactory = function (keyName) {
                    return function (event) {
                        var newState = {};
                        newState[keyName] = !this.state[keyName];

                        that.setState(newState);
                    };
                }
              , searchOnClickDelegate = function (event) {
                    // ...
                };

            return (
                <div className="filters-section row">
                    <BeaconGameFilterToggleButton
                            iconUrl="/img/icons/smash-64-toggle.png"
                            isEnabled={ this.state.isSmash64Enabled }
                            onClick={ toggleButtonFactory('isSmash64Enabled') } />
                    <BeaconGameFilterToggleButton
                            iconUrl="/img/icons/melee-toggle.png"
                            isEnabled={ this.state.isMeleeEnabled }
                            onClick={ toggleButtonFactory('isMeleeEnabled') } />
                    <BeaconGameFilterToggleButton
                            iconUrl="/img/icons/project-m-toggle.png"
                            isEnabled={ this.state.isProjectMEnabled }
                            onClick={ toggleButtonFactory('isProjectMEnabled') } />
                    <BeaconGameFilterToggleButton
                            iconUrl="/img/icons/sm4sh-toggle.png"
                            isEnabled={ this.state.isSm4shEnabled }
                            onClick={ toggleButtonFactory('isSm4shEnabled') } />

                    <IconButton
                            layoutColumns="2"
                            layoutOffset="2"
                            iconType="fa-search"
                            iconSize="fa-3"
                            onClick={ } />
                </div>
            );
        }

    });

    return BeaconFiltersSection;

})();
