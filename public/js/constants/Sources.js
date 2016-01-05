
/**
 * Defines names for action sources. Action sources allow consumers to handle
 * actions differently based on their origin, i.e. HTTP API versus web client.
 *
 * @module constants/Sources
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
        <Module name='Sources' factory={ module.exports.factory } />
    );

};

module.exports.factory = function () {
    'use strict';

    /**
     * Packaged dependencies
     */
    var keymirror = require('keymirror');

    /**
     * List of source names.
     *
     * @exports constants/Sources
     */

    return keymirror({
        Component: null,
        Server: null,
    });

};
