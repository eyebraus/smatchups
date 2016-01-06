
/**
 * Wrapper component which abstracts store interaction away from wrapped
 * component's state. In addition to serving as a base class of sorts for any
 * component which handles data from stores, it also allows "derived" components
 * to receive store data as properties. This is a much cleaner approach than
 * handling the same data through component state.
 *
 * @module components/factories/StoreStateComponent
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
    var Dependency = require('../../injector').Dependency;
    var Module = require('../../injector').Module;

    return (
        <Module name='StoreStateComponentFactory'
                factory={ module.exports.factory } />
    );
};

module.exports.factory = function () {
    'use strict';

    /**
     * Packaged dependencies
     */
    var React = require('react');

    /**
     * Factory function which wraps a given component in StoreStateComponent
     * functionality.
     *
     * @param {Object} Component - component to wrap
     * @param {Object} store - store instance component will receive props from
     * @param {function} getStateFn - function for generating props from the
     *      store instance.
     */

    return function (Component, store, getStateFn) {

        var StoreStateComponent = React.createClass({

            /**
             * Creates initial component state.
             *
             * @returns {Object} Initial component state
             */

            getInitialState: function () {
                return getStateFn(store);
            },

            /**
             * React lifecycle handler, fired when component is finished
             * mounting to the DOM.
             *
             * For this component specifically: attaches a handler to the
             * store's changed event.
             */

            componentDidMount: function () {
                store.addChangedListener(this.onChanged);
            },

            /**
             * React lifecycle handler, fired when component is finished
             * unmounting from the DOM.
             *
             * For this component specifically: detach the changed event handler
             * from the store instance.
             */

            componentWillUnmount: function () {
                store.removeChangedListener(this.onChanged);
            },

            /**
             * Event handler, fired when a changed event is received from the
             * store.
             */

            onChanged: function () {
                this.setState(getStateFn(store));
            },

            /**
             * Generates DOM subtree based on current properties and state.
             *
             * @returns {Object} Current DOM representation of component
             */

            render: function () {
                return (
                    <Component {...this.state} />
                );
            },

        });

        return StoreStateComponent;
    };

};
