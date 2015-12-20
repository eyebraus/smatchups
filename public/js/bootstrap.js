
(function () {
    'use strict';

    /**
     * npm dependencies
     */
    var bulk = require('bulk-require')
      , _ = require('underscore')._
      , winston = require('winston')
        ;

    /**
     * Local dependencies
     */
    var Injector = require('./injector').Injector
        ;

    // Logging
    var logger = new (winston.Logger)({
        transports: [new (winston.transports.Console)()]
    });

    // Load all modules in bulk
    var moduleTree = bulk(__dirname, ['app.js', '**/*.js', '**/*.react.jsx'])
        ;

    var smush = function (obj, id, fn) {
        // Detect if this is a leaf node (base case)
        var isLeaf = true
          , children = {}
            ;

        _.each(obj, function (value, key) {
            if (_.isObject(value) && !_.isArray(value) && !_.isFunction(value)) {
                isLeaf = false;
                children[key] = value;
            }
        });

        // If leaf, return self; if not, iterate further
        if (isLeaf) {
            return [{ key: id, value: obj }];
        } else {
            var flatChildren = []
                ;

            _.each(children, function (child, key) {
                flatChildren = flatChildren.concat(fn(child, id + '/' + key, fn));
            });

            return flatChildren;
        }
    };

    // Process all module configs
    var modules = smush(moduleTree, '.', smush)
      , configs = _.map(modules, function (module) {
            if (!_.has(module.value, 'config') || !_.isFunction(module.value.config)) {
                throw 'Module ' + module.key + ' did not contain property "config" with function value';
            }

            var config = module.value.config()
                ;

            return config;
        })
        ;

    // Run app using given configs
    Injector.run(configs)
        .then(function () {
            logger.info('Application successfully running!');
        })
        .fail(function (err) {
            logger.error(err);
        });

})();
