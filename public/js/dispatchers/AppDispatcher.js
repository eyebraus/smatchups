
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

        handleComponentAction: function (action) {
            var payload = _.extend({ source: Sources.Component }, action);
            this.dispatch(payload);
        },

        handleServerAction: function (action) {
            var payload = _.extend({ source: Sources.Server }, action);
            this.dispatch(payload);
        },

    });

    return AppDispatcher;

};
