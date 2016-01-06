
/**
 * Defines names for events. Events are fired by stores to notify components of
 * changes in application state.
 *
 * @module constants/Events
 */

module.exports.config = function () {
    'use strict';

    /**
     * Packaged dependencies
     */
    var React = require('react');

    /**
     * Local dependencies
     */
    var Dependency = require('../injector').Dependency;
    var Module = require('../injector').Module;

    return (
        <Module name='Events' factory={ module.exports.factory } />
    );

};

module.exports.factory = function () {
    'use strict';

    /**
     * Packaged dependencies
     */
    var keymirror = require('keymirror');

    /**
     * List of event names.
     *
     * @exports constants/Events
     */

    return keymirror({
        BeaconsStoreChanged: null,
    });

};
