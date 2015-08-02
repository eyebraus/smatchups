
(function () {
    'use strict';

    var React = require('react')
      , Router = require('react-router')
      , DefaultRoute = Router.DefaultRoute
      , Route = Router.Route;

    var BeaconsList = require('./BeaconsList.react.jsx')
      , BeaconsMap = require('./BeaconsMap.react.jsx')
      , BeaconsSection = require('./BeaconsSection.react.jsx')
      , Index = require('./Index.react.jsx')
      , Settings = require('./Settings.react.jsx')
      , SmatchupsApp = require('./SmatchupsApp.react.jsx');

    // Set up routes
    var routes = (
        <Route handler={ SmatchupsApp }>
            <DefaultRoute name="index" handler={ Index }>
                <Route name="beacons" path="beacons" handler={ BeaconsSection }>
                    <DefaultRoute name="beacons-list" handler={ BeaconsList } />
                    <Route name="beacons-map" path="map" handler={ BeaconsMap } />
                </Route>
                {/*
                <Route name="events" path="events" handler={ EventsList } />
                <Route name="buddies" path="buddies" handler={ BuddiesList } />
                <Route name="challenges" path="challenges" handler={ ChallengesList } />
                */}
            </DefaultRoute>
            <Route name="settings" path="settings" handler={ Settings } />
        </Route>
    );

    Router.run(routes, function (Root) {
        React.render(<Root />, document.getElementById('smatchups'));
    });

})();
