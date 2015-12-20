
module.exports.config = function () {
    'use strict';

    /**
     * Local dependencies
     */
    var Dependency = require('./injector').Dependency
      , Module = require('./injector').Module
        ;

    return (
        <Module name="Actions" factory={ module.exports.factory } />
    );
};

module.exports.factory = function () {
    'use strict';

    /**
     * npm dependencies
     */
    var keymirror = require('keymirror')
        ;

    return keymirror({
        CreateBeacon: null,
        ReloadBeacons: null
    });

};
