
module.exports = (function () {
    'use strict';

    /**
     * Packaged dependencies
     */
    var React = require('react');
    var q = require('q');
    var _ = require('underscore')._;
    var util = require('util');
    var VargsConstructor = require('vargs').Constructor;

    /**
     * React components
     */

    var Dependency = React.createClass({

        displayName: 'Dependency',

        propTypes: {
            name: React.PropTypes.string.isRequired,
        },

        render: function () {
            return (<noscript />);
        },

    });

    var Module = React.createClass({

        displayName: 'Module',

        getDefaultProps: function () {
            return {
                isRoot: false,
            };
        },

        propTypes: {
            name: React.PropTypes.string.isRequired,
            factory: React.PropTypes.func.isRequired,
            isRoot: React.PropTypes.bool,
        },

        render: function () {
            return (<noscript />);
        },

    });

    /**
     * Injector
     */

    var Injector = function () {
        this.configs = null;
        this.modules = {};
        this.depths = {};
        this.instances = {};
        this.root = null;
        this.states = {};
    };

    Injector.prototype.createModule = function (config) {
        var dependencies = React.Children.map(config.props.children,
            function (child) {
                // Ignore anything that's not of type dependency
                if (child.type === Dependency) {
                    return child.props.name;
                }

                return null;
            });

        return {
            name: config.props.name,
            factory: config.props.factory,
            root: config.props.isRoot,
            dependencies: _.without(dependencies, null),
        };
    };

    Injector.prototype.resolve = function () {
        var args = new (VargsConstructor)(arguments);
        var module = args.first;
        var depth = args.length > 1 ? args.at(1) : 0;
        var resolveStack = args.length > 2 ? args.at(2) : [];
        var that = this;

        // Fail if circular dependency is detected
        if (_.contains(resolveStack, module.name)) {
            var msg = util.format('Circular dependency from %s to itself was '
                + 'found. Stack: [%s]', module.name, resolveStack.join(', '));

            console.error(msg);
            return q.reject(msg);
        }

        // Set depth of module
        this.depths[module.name] = _.has(this.depths, module.name)
            ? _.max([depth, this.depths[module.name]])
            : depth;

        var depPromises = _.map(module.dependencies, function (dependency) {
            // Fail if module doesn't exist
            if (!_.has(that.modules, dependency)
                    || null === that.modules[dependency]) {
                var msg = util.format('While resolving "%s", dependency "%s" '
                    + 'was not found.', module.name, dependency);

                console.error(msg);
                return q.reject(msg);
            }

            return that.resolve(that.modules[dependency], depth + 1,
                resolveStack.concat([module.name]));
        });

        // Resolve dependencies of current module
        return q.all(depPromises);
    };

    Injector.prototype.construct = function () {
        var rejected = false;
        var rejection = null;
        var that = this;

        // Iterate through dependencies descending by depth
        var modulesDepthSorted = _.chain(this.depths)
            .map(function (depth, moduleName) {
                return { depth: depth, moduleName: moduleName };
            })
            .sortBy(function (obj) {
                return obj.depth * -1;
            })
            .value();

        _.each(modulesDepthSorted, function (obj) {
            // Effectively a continue statement
            if (rejected) {
                return;
            }

            var moduleName = obj.moduleName;
            var module = that.modules[moduleName];
            var dependencies = [];

            _.each(module.dependencies, function (dependencyName) {
                // Fail if any of the dependencies haven't been constructed yet
                if (null === that.instances[dependencyName]) {
                    var msg = util.format('While constructing %s, dependency '
                        + '%s had not been constructed yet', module.name,
                        dependencyName);

                    console.error(msg);
                    rejection = q.reject(msg);
                    rejected = true;
                }

                dependencies.push(that.instances[dependencyName]);
            });

            if (!rejected) {
                // Construct instance of module
                that.instances[module.name] = module.factory.apply(
                    module.factory, dependencies);
            }
        });

        // Return any rejections
        if (rejected) {
            return rejection;
        }

        // Fail if root instance was somehow not initialized
        if (!_.has(this.instances, this.root.name)) {
            var msg = util.format('Root module %s was not constructed',
                this.root.name);

            console.error(msg);
            return q.reject(msg);
        }

        return q.fcall(function () {
            return that.instances[that.root.name];
        });
    };

    Injector.prototype.run = function (configs) {
        var msg = '';
        var rejected = false;
        var rejection = null;
        var that = this;

        this.configs = configs;

        // Register all modules given
        _.each(configs, function (config) {
            if (rejected) {
                // Effectively a continue statement
            } else if (!React.isValidElement(config)) {
                msg = 'Config was not a valid React element';

                console.error(msg);
                rejection = q.reject(msg);
                rejected = true;
            } else {
                var module = that.createModule(config);

                if (_.has(that.modules, module.name)) {
                    console.warn('Module with name "' + module.name
                        + '" registered more than once.');
                }

                that.modules[module.name] = module;
                that.states[module.name] = 'unresolved';

                if (module.root) {
                    if (null !== that.root) {
                        msg = 'More than one root module was defined.';

                        console.error(msg);
                        rejection = q.reject(msg);
                        rejected = true;
                    } else {
                        that.root = module;
                    }
                }
            }
        });

        // Return any rejection uncovered while iterating
        if (rejected) {
            return rejection;
        }

        // Ensure that an entry point was defined
        if (null === that.root) {
            msg = 'One module must be specified as root.';

            console.error(msg);
            return q.reject(msg);
        }

        // Resolve dependencies and run at entry point
        return that.resolve(that.root)
            .then(function () {
                return that.construct();
            });
    };

    return {
        Dependency: Dependency,
        Injector: Injector,
        Module: Module,
    };

})();
