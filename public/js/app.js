
(function () {
    'use strict';

    var React = require('react')
      , SmatchupsApp = require('./components/SmatchupsApp.react.jsx');

    React.render(
        <SmatchupsApp />,
        document.getElementById('smatchups'));

})();
