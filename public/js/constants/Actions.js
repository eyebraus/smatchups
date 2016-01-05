
/**
 * Defines names for actions. Actions are issued by components via action
 * creators, and are dispatched to a dispatcher once they are completed.
 *
 * @module constants/Actions
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
        <Module name='Actions' factory={ module.exports.factory } />
    );

};

module.exports.factory = function () {
    'use strict';

    /**
     * Packaged dependencies
     */
    var keymirror = require('keymirror');

    /**
     * List of action names.
     *
     * @exports constants/Actions
     */

    return keymirror({
        CreateBeacon: null,
        ReloadBeacons: null,
    });

};
