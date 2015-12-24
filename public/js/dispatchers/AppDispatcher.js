
module.exports.config = function () {
    'use strict';

    /**
     * npm dependencies
     */
    var React = require('react')
        ;

    /**
     * Local dependencies
     */
    var Dependency = require('../injector').Dependency
      , Module = require('../injector').Module
        ;

    return (
        <Module name="AppDispatcher" factory={ module.exports.factory }>
            <Dependency name="Sources" />
        </Module>
    );
};

module.exports.factory = function (Sources) {
    'use strict';

    /**
     * npm dependencies
     */
    var Dispatcher = require('flux').Dispatcher
      , assign = require('object-assign')
      , _ = require('underscore')._
        ;

    var AppDispatcher = assign(new Dispatcher(), {

        handleComponentAction: function (action) {
            var payload = _.extend({ source: Sources.Component }, action);
            this.dispatch(payload);
        },

        handleServerAction: function (action) {
            var payload = _.extend({ source: Sources.Server }, action);
            this.dispatch(payload);
        }
        
    });

    return AppDispatcher;

};
