
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
        
        onToggledFactory: function (keyName) {
            var that = this;

            return function (toggleState) {
                var newState = {};
                newState[keyName] = toggleState;

                that.setState(newState);
            };
        },

        render: function () {
            return (
                <div className="row">
                    <div className="beacons-section-wrapper col-xs-12 col-sm-12 col-md-12">
                        <div className="beacons-section-filters row">
                            <ToggleImageButton
                                    imageUrl="/app/img/icon/smash-64-toggle.png"
                                    imageWidth="24"
                                    imageHeight="24"
                                    layoutColumns="2"
                                    toggleState={ this.state.isSmash64Enabled }
                                    onToggled={ this.onToggledFactory('isSmash64Enabled') } />
                            <ToggleImageButton
                                    imageUrl="/app/img/icon/melee-toggle.png"
                                    imageWidth="24"
                                    imageHeight="24"
                                    layoutColumns="2"
                                    toggleState={ this.state.isMeleeEnabled }
                                    onToggled={ this.onToggledFactory('isMeleeEnabled') } />
                            <ToggleImageButton
                                    imageUrl="/app/img/icon/project-m-toggle.png"
                                    imageWidth="24"
                                    imageHeight="24"
                                    layoutColumns="2"
                                    toggleState={ this.state.isProjectMEnabled }
                                    onToggled={ this.onToggledFactory('isProjectMEnabled') } />
                            <ToggleImageButton
                                    imageUrl="/app/img/icon/sm4sh-toggle.png"
                                    imageWidth="24"
                                    imageHeight="24"
                                    layoutColumns="2"
                                    toggleState={ this.state.isSm4shEnabled }
                                    onToggled={ this.onToggledFactory('isSm4shEnabled') } />

                            <LinkedIconButton
                                    iconSize="fa-3"
                                    iconType="fa-plus"
                                    layoutColumns="3"
                                    layoutOffset="1"
                                    routeName="create-beacon" />
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
