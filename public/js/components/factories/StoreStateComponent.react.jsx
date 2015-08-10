
module.exports = (function () {
    'use strict';

    var React = require('react');

    return function (Component, store, getStateFn) {
        var StoreStateComponent = React.createClass({

            getInitialState: function () {
                return getStateFn(store);
            },

            componentDidMount: function () {
                store.addChangedListener(this.onChanged);
            },

            componentDidUnmount: function () {
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

})();
