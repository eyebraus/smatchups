
module.exports.config = function () {
    'use strict';

    /**
     * Local dependencies
     */
    var Dependency = require('./injector').Dependency
      , Module = require('./injector').Module
        ;

    return (
        <Module name="Application" factory={ module.exports.factory } isRoot={ true }>
            <Dependency name="App" />
            <Dependency name="BeaconsSection" />
            <Dependency name="BuddiesList" />
            <Dependency name="ChallengesList" />
            <Dependency name="EventsList" />
            <Dependency name="Settings" />
        </Module>
    );

};

module.exports.factory = function (App, BeaconsSection, BuddiesList, ChallengesList, EventsList, Settings) {
    'use strict';

    /**
     * npm dependencies
     */
    var React = require('react')

    // react-router modules
      , Router = require('react-router')
      , DefaultRoute = Router.DefaultRoute
      , Route = Router.Route
        ;

    // Set up routes
    var routes = (
        <Route handler={ App }>
            <Route name="beacons" path="beacons" handler={ BeaconsSection } />
            <Route name="events" path="events" handler={ EventsList } />
            <Route name="buddies" path="buddies" handler={ BuddiesList } />
            <Route name="challenges" path="challenges" handler={ ChallengesList } />
            <Route name="settings" path="settings" handler={ Settings } />
        </Route>
    );

    Router.run(routes, function (Root) {
        React.render(<Root />, document.getElementById('smatchups'));
    });

};
