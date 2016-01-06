
/**
 * React component: input element for providing a number of setups a beacon or
 * event will have. Contains a numeric input next to the game's icon.
 *
 * @module components/SetupInputElement
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
        <Module name='SetupInputElement' factory={ module.exports.factory } />
    );

};

module.exports.factory = function () {
    'use strict';

    /**
     * Packaged dependencies
     */
    var React = require('react');

    // React Bootstrap modules
    var Input = require('react-bootstrap').Input;

    var SetupInputElement = React.createClass({

        /**
         * Generates DOM subtree based on current properties and state.
         *
         * @returns {Object} Current DOM representation of component
         */

        render: function () {
            return (
                <div className='input-group'>
                    <div className='input-group-addon'>
                        <img src={ this.props.imageUrl }
                                width='20'
                                height='20' />
                    </div>
                    <Input name={ this.props.name }
                            type='number'
                            value={ this.props.value }
                            onChange={ this.props.onChange }
                            min='0'
                            step='1' />
                </div>
            );
        },

    });

    return SetupInputElement;

};
