
module.exports = (function () {
    'use strict';

    var React = require('react');

    var BeaconFeedSection = require('./BeaconFeedSection.react.jsx')
      , BeaconFiltersSection = require('./BeaconFiltersSection.react.jsx')
      , Header = require('./Header.react.jsx')
      , TabControl = require('./TabControl.react.jsx')
      , TabControlIconHeader = require('./TabControlIconHeader.react.jsx')
      , TabControlSection = require('./TabControlSection.react.jsx');

    /*
     * App scenes
     * ----------------
     * Helper components swappable based on app state.
     */

    var MainScene = React.createClass({

        render: function () {
            return (
                <TabControl
                        headerComponent={ TabControlIconHeader }
                        headerComponentProps={ [
                            { iconType: 'fa-gamepad', iconSize: 'fa-3' },
                            { iconType: 'fa-calendar', iconSize: 'fa-3' },
                            { iconType: 'fa-users', iconSize: 'fa-3' },
                            { iconType: 'fa-user-secret', iconSize: 'fa-3' }] }
                        layoutColumns="12">

                    <TabControlSection
                            layoutColumns="12">
                        <BeaconFiltersSection />
                        <BeaconFeedSection />
                    </TabControlSection>

                    <TabControlSection
                            layoutColumns="12">
                        <div>
                            blah
                        </div>
                    </TabControlSection>

                    <TabControlSection
                            layoutColumns="12">
                        <div>
                            blah
                        </div>
                    </TabControlSection>

                    <TabControlSection
                            layoutColumns="12">
                        <div>
                            blah
                        </div>
                    </TabControlSection>

                </TabControl>
            );
        }

    });

    var MenuScene = React.createClass({

        render: function () {
            return (
                <div>
                    don't care
                </div>
            );
        }

    });

    /*
     * SmatchupsApp
     * ----------------
     * Main app component
     */

    var SmatchupsApp = React.createClass({

        getInitialState: function () {
            return {
                activeSceneName: 'Main'
            };
        },

        render: function () {
            var that = this
              , toggleMenuButtonAction = function () {
                    var nextStateName = this.state.activeSceneName === 'Main' ? 'Menu' : 'Main';

                    that.setState({ activeSceneName: nextStateName });
                };

            return (
                <div className="smatchups-app container">
                    <Header
                            layoutColumns="12"
                            toggleMenuButtonAction={ toggleMenuButtonAction } />

                    { this.activeScene() }
                </div>
            );
        },

        activeScene: function () {
            if (this.state.activeSceneName === 'Main') {
                return (
                    <MainScene />
                );
            }

            if (this.state.activeSceneName === 'Menu') {
                return (
                    <MenuScene />
                );
            }
        }

    });

    return SmatchupsApp;

})();
