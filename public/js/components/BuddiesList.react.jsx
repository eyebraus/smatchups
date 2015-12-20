
module.exports.config = function () {
    'use strict';

    /**
     * Local dependencies
     */
    var Dependency = require('./injector').Dependency
      , Module = require('./injector').Module
        ;

    return (
        <Module name="BuddiesList" factory={ module.exports.factory } />
    );
};

module.exports.factory = function () {
    'use strict';

    /**
     * npm dependencies
     */
    var React = require('react')

    // react-bootstrap modules
      , Row = require('react-bootstrap').Row
        ;

    var BuddiesList = React.createClass({

        render: function () {
            return (
                <Row className="buddies-list">
                    <h3>Nothing here yet :)</h3>
                </Row>
            );
        }

    });

    return BuddiesList;

};
