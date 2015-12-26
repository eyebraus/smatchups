
module.exports.config = function () {
    'use strict';

    /**
     * npm dependencies
     */
    var React = require('react');

    /**
     * Local dependencies
     */
    var Dependency = require('../injector').Dependency,
        Module = require('../injector').Module;

    return (
        <Module name="Events" factory={ module.exports.factory } />
    );
};

module.exports.factory = function () {
    'use strict';

    /**
     * npm dependencies
     */
    var keymirror = require('keymirror');

    return keymirror({
        BeaconsStoreChanged: null
    });

};
