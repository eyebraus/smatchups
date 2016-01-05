
/**
 * React component: settings menu for users.
 *
 * @module components/Settings
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
        <Module name='Settings' factory={ module.exports.factory } />
    );

};

module.exports.factory = function () {
    'use strict';

    /**
     * Packaged dependencies
     */
    var React = require('react');

    // React Bootstrap modules
    var Col = require('react-bootstrap').Col;
    var Row = require('react-bootstrap').Row;

    // React Router modules
    var Router = require('react-router');
    var Link = Router.Link;

    var Settings = React.createClass({

        /**
         * Generates DOM subtree based on current properties and state.
         *
         * @returns {Object} Current DOM representation of component
         */

        render: function () {
            return (
                <Row>
                    <Col className='settings-menu'
                            xs={ 12 }
                            sm={ 12 }
                            md={ 12 }>
                        <h3>Nothing here yet :)</h3>
                    </Col>
                </Row>
            );
        },

    });

    return Settings;

};
