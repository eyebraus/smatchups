
(function () {
    'use strict';

    /**
     * npm dependencies
     */
    var _ = require('underscore')._
        ;

    /**
     * Local dependencies
     */
    var Injector = require('./injector').Injector
      , manifest = require('./manifest')
        ;

    // Process all module configs
    var configs = _.map(manifest, function (module, index) {
        if (!_.has(module, 'config') || !_.isFunction(module.config)) {
            throw 'Module at index ' + index + ' did not contain property "config" with function value';
        }

        return module.config();
    });

    // Run app using given configs
    var injector = new Injector()
        ;

    injector.run(configs)
        .then(function () {
            console.info('Application successfully running!');
        })
        .fail(function (err) {
            console.error(err);
        });

})();
