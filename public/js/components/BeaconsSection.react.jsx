
module.exports = (function () {
    'use strict';

    var React = require('react')
      , Router = require('react-router')
      , RouteHandler = Router.RouteHandler;

    var LinkedIconButton = require('./LinkedIconButton.react.jsx')
      , ToggleImageButton = require('./ToggleImageButton.react.jsx');

    var BeaconsSection = React.createClass({

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
              , onToggledFactory = function (keyName) {
                    return function (toggleState) {
                        var newState = {};
                        newState[keyName] = toggleState;

                        that.setState(newState);
                    };
                };

            return (
                <div className="row">
                    <div className="beacons-section-wrapper col-xs-12 col-sm-12 col-md-12">
                        <div className="beacons-section-filters row">
                            <ToggleImageButton
                                    iconUrl="/img/icons/smash-64-toggle.png"
                                    layoutColumns="3"
                                    toggleState={ this.state.isSmash64Enabled }
                                    onToggled={ onToggledFactory('isSmash64Enabled') } />
                            <ToggleImageButton
                                    iconUrl="/img/icons/melee-toggle.png"
                                    layoutColumns="3"
                                    toggleState={ this.state.isMeleeEnabled }
                                    onToggled={ onToggledFactory('isMeleeEnabled') } />
                            <ToggleImageButton
                                    iconUrl="/img/icons/project-m-toggle.png"
                                    layoutColumns="3"
                                    toggleState={ this.state.isProjectMEnabled }
                                    onToggled={ onToggledFactory('isProjectMEnabled') } />
                            <ToggleImageButton
                                    iconUrl="/img/icons/sm4sh-toggle.png"
                                    layoutColumns="3"
                                    toggleState={ this.state.isSm4shEnabled }
                                    onToggled={ onToggledFactory('isSm4shEnabled') } />
                        </div>

                        <div className="beacons-section row">
                            <RouteHandler />

                            <div className="beacons-section-toggle-mode col-xs-12 col-sm-12 col-md-12">
                                <LinkedIconButton
                                        iconSize="fa-3"
                                        iconType="fa-list"
                                        layoutColumns="6"
                                        routeName="beacons-list" />
                                <LinkedIconButton
                                        iconSize="fa-3"
                                        iconType="fa-globe"
                                        layoutColumns="6"
                                        routeName="beacons-map" />
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

    });

    return BeaconsSection;

})();
