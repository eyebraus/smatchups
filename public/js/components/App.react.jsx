
module.exports = (function () {
    'use strict';

    var React = require('react')
      , Col = require('react-bootstrap').Col
      , CollapsibleNav = require('react-bootstrap').CollapsibleNav
      , Grid = require('react-bootstrap').Grid
      , Nav = require('react-bootstrap').Nav
      , Navbar = require('react-bootstrap').Navbar
      , NavItem = require('react-bootstrap').NavItem
      , PageHeader = require('react-bootstrap').PageHeader
      , Row = require('react-bootstrap').Row
      , Router = require('react-router')
      , Navigation = Router.Navigation
      , RouteHandler = Router.RouteHandler;

    var SmatchupsApp = React.createClass({

        mixins: [Navigation],

        getInitialState: function () {
            return {};
        },

        componentDidMount: function () {
            // Hacky: force a "DefaultRoute" in code-behind so page isn't blank
            this.replaceWith('beacons');
        },

        onNavSelect: function (selectedKey) {
            this.transitionTo(selectedKey);
        },

        render: function () {
            return (
                <Grid>
                    <Navbar brand={ <a href="#">Smatchups</a> } toggleNavKey={ 0 }>
                        <CollapsibleNav eventKey={ 0 }>
                            <Nav navbar onSelect={ this.onNavSelect }>
                                <NavItem eventKey={ 'beacons' }>Beacons</NavItem>
                                <NavItem eventKey={ 'events' }>Events</NavItem>
                                <NavItem eventKey={ 'buddies' }>Buddies</NavItem>
                                <NavItem eventKey={ 'challenges' }>Challenges</NavItem>
                            </Nav>

                            <Nav navbar right onSelect={ this.onNavSelect }>
                                <NavItem eventKey={ 'settings' }>Settings</NavItem>
                            </Nav>
                        </CollapsibleNav>
                    </Navbar>

                    <RouteHandler />
                </Grid>
            );
        }

    });

    return SmatchupsApp;

})();
