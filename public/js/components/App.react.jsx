
module.exports.config = function () {
    'use strict';

    /**
     * Packaged dependencies
     */
    var React = require('react');

    /**
     * Local dependencies
     */
    var Module = require('../injector').Module;

    return (
        <Module name='App' factory={ module.exports.factory } />
    );

};

module.exports.factory = function () {
    'use strict';

    /**
     * Packaged dependencies
     */
    var React = require('react');

    // React Bootstrap modules
    var Col = require('react-bootstrap').Col;
    var CollapsibleNav = require('react-bootstrap').CollapsibleNav;
    var Grid = require('react-bootstrap').Grid;
    var Nav = require('react-bootstrap').Nav;
    var Navbar = require('react-bootstrap').Navbar;
    var NavItem = require('react-bootstrap').NavItem;
    var PageHeader = require('react-bootstrap').PageHeader;
    var Row = require('react-bootstrap').Row;

    // ReactRouter modules
    var Router = require('react-router');
    var Navigation = Router.Navigation;
    var RouteHandler = Router.RouteHandler;

    var SmatchupsApp = React.createClass({

        mixins: [Navigation],

        getInitialState: function () {
            return {
                activeRoute: 'beacons',
            };
        },

        onNavSelect: function (selectedKey) {
            this.transitionTo(selectedKey);

            this.setState({ activeRoute: selectedKey });
        },

        render: function () {
            return (
                <Grid>
                    <Navbar brand={ <a href='#'>Smatchups</a> } fixedTop
                            toggleNavKey={ 0 }>
                        <CollapsibleNav activeKey={ this.state.activeRoute }
                                eventKey={ 0 }>
                            <Nav navbar onSelect={ this.onNavSelect }>
                                <NavItem eventKey={ 'beacons' }>
                                    Beacons
                                </NavItem>

                                <NavItem eventKey={ 'events' }>
                                    Events
                                </NavItem>

                                <NavItem eventKey={ 'buddies' }>
                                    Buddies
                                </NavItem>

                                <NavItem eventKey={ 'challenges' }>
                                    Challenges
                                </NavItem>
                            </Nav>

                            <Nav navbar right onSelect={ this.onNavSelect }>
                                <NavItem eventKey={ 'settings' }>
                                    Settings
                                </NavItem>
                            </Nav>
                        </CollapsibleNav>
                    </Navbar>

                    <RouteHandler />
                </Grid>
            );
        },

    });

    return SmatchupsApp;

};
