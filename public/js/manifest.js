
/**
 * Loads all modules in the app via CommonJS. Awkward solution, but allows files
 * with config functions to be easily located and generated.
 *
 * @module manifest
 */

module.exports = (function () {
    'use strict';

    return [
        // Root
        require('./app'),

        // Action creators
        require('./actions/BeaconsResourceActions'),

        // Components
        require('./components/App.react.jsx'),
        require('./components/Autocomplete.react.jsx'),
        require('./components/BeaconForm.react.jsx'),
        require('./components/BeaconsSection.react.jsx'),
        require('./components/BuddiesList.react.jsx'),
        require('./components/ChallengesList.react.jsx'),
        require('./components/EventsList.react.jsx'),
        require('./components/LinkedIconButton.react.jsx'),
        require('./components/Settings.react.jsx'),
        require('./components/SetupInputElement.react.jsx'),
        require('./components/ToggleImageButton.react.jsx'),
        require('./components/factories/StoreStateComponent.react.jsx'),

        // Constants
        require('./constants/Actions'),
        require('./constants/Events'),
        require('./constants/Sources'),

        // Dispatchers
        require('./dispatchers/AppDispatcher'),

        // Resources
        require('./resources/BeaconsResource'),

        // Stores
        require('./stores/BeaconsStore'),

        // Utilities
        require('./utilities/geoPromise'),
        require('./utilities/httpPromise'),
    ];

})();
