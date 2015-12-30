
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
        <Module name='EventsList' factory={ module.exports.factory } />
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

    var EventsList = React.createClass({

        render: function () {
            return (
                <Row className='events-list'>
                    <h3>Nothing here yet :)</h3>
                </Row>
            );
        },

    });

    return EventsList;

};
