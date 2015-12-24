
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
    var Dependency = require('../../injector').Dependency
      , Module = require('../../injector').Module
        ;

    return (
        <Module name="StoreStateComponentFactory" factory={ module.exports.factory } />
    );
};

module.exports.factory = function () {
    'use strict';

    /**
     * npm dependencies
     */
    var React = require('react')
        ;

    return function (Component, store, getStateFn) {
        var StoreStateComponent = React.createClass({

            getInitialState: function () {
                return getStateFn(store);
            },

            componentDidMount: function () {
                store.addChangedListener(this.onChanged);
            },

            componentWillUnmount: function () {
                store.removeChangedListener(this.onChanged);
            },

            onChanged: function () {
                this.setState(getStateFn(store));
            },

            render: function () {
                return (
                    <Component {...this.state} />
                );
            }

        });

        return StoreStateComponent;
    };

};
