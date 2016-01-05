
/**
 * React component: index page listing any head-to-head challenges sent to user.
 * Allows for arrangement of money match terms, as well as resolving the outcome
 * of such matches.
 *
 * @module components/ChallengesList
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
        <Module name='ChallengesList' factory={ module.exports.factory } />
    );

};

module.exports.factory = function () {
    'use strict';

    /**
     * Packaged dependencies
     */
    var React = require('react');

    // React Bootstrap modules
    var Row = require('react-bootstrap').Row;

    var ChallengesList = React.createClass({

        /**
         * Generates DOM subtree based on current properties and state.
         *
         * @returns {Object} Current DOM representation of component
         */

        render: function () {
            return (
                <Row className='challenges-list'>
                    <h3>Nothing here yet :)</h3>
                </Row>
            );
        },

    });

    return ChallengesList;

};
