
module.exports = (function () {
    'use strict';

    var assign = require('object-assign')
      , Dispatcher = require('flux').Dispatcher
      , Sources = require('../constants/Sources')
      , _ = require('underscore')._;

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

})();
