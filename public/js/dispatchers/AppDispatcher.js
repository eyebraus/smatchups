
/**
 * Dispatcher for entire Smatchups application. Receives action notifications
 * when action creators have completed their work, and forwards notices and any
 * resulting data to consuming stores.
 *
 * @module dispatchers/AppDispatcher
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
        <Module name='AppDispatcher' factory={ module.exports.factory }>
            <Dependency name='Sources' />
        </Module>
    );

};

module.exports.factory = function (Sources) {
    'use strict';

    /**
     * Packaged dependencies
     */
    var Dispatcher = require('flux').Dispatcher;
    var assign = require('object-assign');
    var _ = require('underscore')._;

    var AppDispatcher = assign(new Dispatcher(), {

        /**
         * Dispatch notifications of view-originating actions to observers.
         *
         * @param {Object} action - data payload from the action. Gets extended
         *      with the source property before dispatch.
         */

        handleComponentAction: function (action) {
            var payload = _.extend({ source: Sources.Component }, action);
            this.dispatch(payload);
        },

        /**
         * Dispatch notifications of server-originating actions to observers.
         *
         * @param {Object} action - data payload from the action. Gets extended
         *      with the source property before dispatch.
         */

        handleServerAction: function (action) {
            var payload = _.extend({ source: Sources.Server }, action);
            this.dispatch(payload);
        },

    });

    return AppDispatcher;

};
