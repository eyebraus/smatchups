
/**
 * React component which wraps a Google Places API autocomplete textbox.
 *
 * @module components/Autocomplete
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
    var Dependency = require('../injector').Dependency;
    var Module = require('../injector').Module;

    return (
        <Module name='Autocomplete' factory={ module.exports.factory } />
    );

};

module.exports.factory = function () {
    'use strict';

    /**
     * Packaged dependencies
     */
    var React = require('react');

    var Autocomplete = React.createClass({

        /**
         * React lifecycle handler, fired when component is finished mounting to
         * the DOM.
         *
         * For this component specifically: create a new Autocomplete on the
         * component's textbox; set its bounds via the received bounds prop;
         * attach a handler to the Plcaes place_changed event, which updates
         * bounds as the position changes.
         */

        componentDidMount: function () {
            var that = this;

            this.autocomplete = new google.maps.places.Autocomplete(
                this.refs.textbox.getDOMNode());
            this.autocomplete.setBounds(this.props.bounds);

            this.autocomplete.addListener('place_changed', function () {
                that.props.onPlaceChanged(that.autocomplete.getPlace());
            });
        },

        /**
         * React lifecycle handler, fired when component is finished updating
         * after a props or state change.
         *
         * For this component specifically: keep the Autocomplete bounds in sync
         * with the bounds receieved from the props.
         */

        componentDidUpdate: function () {
            this.autocomplete.setBounds(this.props.bounds);
        },

        /**
         * Generates DOM subtree based on current properties and state.
         *
         * @returns {Object} Current DOM representation of component
         */

        render: function () {
            return (
                <div className='form-group'>
                    <label className='control-label'>
                        { this.props.label }
                    </label>

                    <input className='form-control'
                            label={ this.props.label }
                            name={ this.props.name }
                            placeholder={ this.props.placeholder }
                            type='text'
                            value={ this.props.value }
                            ref='textbox'
                            onChange={ this.props.onChange } />
                </div>
            );
        },

    });

    return Autocomplete;

};
