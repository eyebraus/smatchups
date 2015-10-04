
(function () {
    'use strict';

    var React = require('react')
      , Router = require('react-router')
      , DefaultRoute = Router.DefaultRoute
      , Route = Router.Route;

    var App = require('./components/App.react.jsx')
      , BeaconsSection = require('./components/BeaconsSection.react.jsx')
      , BuddiesList = require('./components/BuddiesList.react.jsx')
      , ChallengesList = require('./components/ChallengesList.react.jsx')
      , CreateBeacon = require('./components/CreateBeacon.react.jsx')
      , EventsList = require('./components/EventsList.react.jsx')
      , Settings = require('./components/Settings.react.jsx');

    // Set up routes
    var routes = (
        <Route handler={ App }>
            <Route name="beacons" path="beacons" handler={ BeaconsSection } />
            <Route name="events" path="events" handler={ EventsList } />
            <Route name="buddies" path="buddies" handler={ BuddiesList } />
            <Route name="challenges" path="challenges" handler={ ChallengesList } />
            <Route name="create-beacon" path="create-beacon" handler={ CreateBeacon } />
            <Route name="settings" path="settings" handler={ Settings } />
        </Route>
    );

    Router.run(routes, function (Root) {
        React.render(<Root />, document.getElementById('smatchups'));
    });

})();
