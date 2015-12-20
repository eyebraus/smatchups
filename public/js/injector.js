
module.exports = (function () {
    'use strict';

    /**
     * npm dependencies
     */
    var
        React = require('react')
      , q = require('q')
      , _ = require('underscore')._
      , util = require('util')
      , winston = require('winston')
        ;

    // Logging
    var logger = new (winston.Logger)({
        transports: [new (winston.transports.Console)()]
    });

    /**
     * React components
     */

    var Dependency = React.createClass({

        displayName: 'Dependency',

        propTypes: {
            name: React.propTypes.string.isRequired
        }

    });

    var Module = React.createClass({

        displayName: 'Module',

        getDefaultProps: function () {
            return {
                isRoot: false
            };
        },

        propTypes: {
            name: React.propTypes.string.isRequired,
            factory: React.propTypes.func.isRequired,
            isRoot: React.propTypes.bool,
        }

    });

    /**
     * Injector
     */

    var Injector = function () {
        this.configs = null;
        this.modules = {};
        this.instances = {};
        this.root = null;
        this.states = {};
    };

    Injector.prototype.createModule = function (config) {
        var dependencies = _.map(config.props.children, function (child) {
            // Ignore anything that's not of type dependency
            if (child.type === Dependency) {
                return child.name;
            } else {
                return null;
            }
        });

        return {
            name: config.props.name,
            factory: config.props.factory,
            root: config.props.isRoot,
            dependencies: _.without(dependencies, null)
        };
    };

    Injector.prototype.resolve = function (module) {
        var deferral = q.defer()
          , that = this
            ;

        process.nextTick(function () {
            // Set state to resolving
            that.states[module.name] = 'resolving';

            var depInstancePromises = _.map(module.dependencies, function (dependency) {
                // Fail if module doesn't exist
                if (!_.has(that.modules, dependency) || null === that.modules[dependency]) {
                    deferral.reject(util.format('While resolving "%s", dependency "%s" was not found.',
                        module.name, dependency));
                }

                // Fail if circular reference is detected
                if ('resolving' === that.states[dependency]) {
                    deferral.reject(util.format('While resolving "%s", circular dependency "%s" was found.',
                        module.name, dependency));
                }

                // Return instance immediately if it already exists
                if ('resolved' === that.states[dependency]) {
                    return q.fcall(function () {
                        return that.instances[dependency];
                    });
                }

                return that.resolve(that.modules[dependency]);
            });

            // Execute promises for dependencies and create instance
            q.all(depInstancePromises)
                .then(function (depInstances) {
                    that.instances[module.name] = module.factory.apply(module.factory, depInstances);
                    that.states[module.name] = 'resolved';

                    deferral.resolve(that.instances[module.name]);
                });
        });

        return deferral;
    };

    Injector.prototype.run = function (configs) {
        var deferral = q.defer()
          , that = this
            ;

        process.nextTick(function () {
            // Register all modules given
            _.each(configs, function (config) {
                if (!React.isValidElement(config)) {
                    deferral.reject('Config was not a valid React element');
                }

                var module = that.createModule(config)
                    ;

                if (_.has(that.modules, module.name)) {
                    logger.warn('Module with name "' + module.name + '" registered more than once.');
                };

                that.modules[module.name] = module;
                that.states[module.name] = 'unresolved';

                if (module.isRoot) {
                    if (null !== that.root) {
                        deferral.reject('More than one root module was defined.');
                    }

                    that.root = module;
                }
            });

            // Ensure that an entry point was defined
            if (null === that.root) {
                deferral.reject('One module must be specified as root.');
            }

            // Resolve dependencies and run at entry point
            that.resolve(that.root)
                .then(function () {
                    logger.info('Dependencies loaded and resolved :)');
                });
        });

        this.configs = configs;

        return deferral;
    };

    return {
        Dependency: Dependency,
        Injector: Injector,
        Module: Module
    };

})();
