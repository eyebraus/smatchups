
module.exports.config = function () {
    'use strict';

    /**
     * Packaged dependencies
     */
    var React = require('react');

    /**
     * Local dependencies
     */
    var Dependency = require('./injector').Dependency;
    var Module = require('./injector').Module;

    return (
        <Module name='Application' factory={ module.exports.factory }
                isRoot={ true }>
            <Dependency name='App' />
            <Dependency name='BeaconsSection' />
            <Dependency name='BuddiesList' />
            <Dependency name='ChallengesList' />
            <Dependency name='EventsList' />
            <Dependency name='Settings' />
        </Module>
    );

};

module.exports.factory = function (App, BeaconsSection, BuddiesList,
        ChallengesList, EventsList, Settings) {
    'use strict';

    /**
     * Packaged dependencies
     */
    var React = require('react');

    // ReactRouter modules
    var Router = require('react-router');
    var DefaultRoute = Router.DefaultRoute;
    var Route = Router.Route;

    // Set up routes
    var routes = (
        <Route handler={ App }>
            <Route name='beacons' path='beacons' handler={ BeaconsSection } />
            <Route name='events' path='events' handler={ EventsList } />
            <Route name='buddies' path='buddies' handler={ BuddiesList } />
            <Route name='challenges' path='challenges'
                handler={ ChallengesList } />
            <Route name='settings' path='settings' handler={ Settings } />
        </Route>
    );

    Router.run(routes, function (Root) {
        React.render(<Root />, document.getElementById('smatchups'));
    });

    return null;

};
