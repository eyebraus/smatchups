
(function () {
    'use strict';

    var React = require('react')
      , Router = require('react-router')
      , DefaultRoute = Router.DefaultRoute
      , Route = Router.Route;

    var App = require('./components/App.react.jsx')
      , BeaconsList = require('./components/BeaconsList.react.jsx')
      , BeaconsMap = require('./components/BeaconsMap.react.jsx')
      , BeaconsSection = require('./components/BeaconsSection.react.jsx')
      , CreateBeacon = require('./components/CreateBeacon.react.jsx')
      , Index = require('./components/Index.react.jsx')
      , Settings = require('./components/Settings.react.jsx');

    // Set up routes
    var routes = (
        <Route handler={ App }>
            <Route name="index" path="index" handler={ Index }>
                <Route name="beacons" path="beacons" handler={ BeaconsSection }>
                    <DefaultRoute name="beacons-list" handler={ BeaconsList } />
                    <Route name="beacons-map" path="map" handler={ BeaconsMap } />
                </Route>
                {/*
                <Route name="events" path="events" handler={ EventsList } />
                <Route name="buddies" path="buddies" handler={ BuddiesList } />
                <Route name="challenges" path="challenges" handler={ ChallengesList } />
                */}
            </Route>
            <Route name="create-beacon" path="create-beacon" handler={ CreateBeacon } />
            <Route name="settings" path="settings" handler={ Settings } />
        </Route>
    );

    Router.run(routes, function (Root) {
        React.render(<Root />, document.getElementById('smatchups'));
    });

})();
