
module.exports.config = function () {
    'use strict';

    /**
     * Local dependencies
     */
    var Dependency = require('./injector').Dependency
      , Module = require('./injector').Module
        ;

    return (
        <Module name="SetupInputElement" factory={ module.exports.factory } />
    );
};

module.exports.factory = function () {
    'use strict';

    /**
     * npm dependencies
     */
    var React = require('react')

    // react-bootstrap modules
      , Input = require('react-bootstrap').Input
        ;

    var SetupInputElement = React.createClass({

        render: function () {
            return (
                <div className="input-group">
                    <div className="input-group-addon">
                        <img src={ this.props.imageUrl } width="20" height="20" />
                    </div>
                    <Input name={ this.props.name }
                            type="number"
                            value={ this.props.value }
                            onChange={ this.props.onChange }
                            min="0"
                            step="1" />
                </div>
            );
        }

    });

    return SetupInputElement;

};
