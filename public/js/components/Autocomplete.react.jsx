
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
        <Module name="Autocomplete" factory={ module.exports.factory } />
    );

};

module.exports.factory = function () {
    'use strict';

    /**
     * npm dependencies
     */
    var React = require('react');

    var Autocomplete = React.createClass({

        componentDidMount: function () {
            var that = this;

            this.autocomplete = new google.maps.places.Autocomplete(this.refs.textbox.getDOMNode());
            this.autocomplete.setBounds(this.props.bounds);

            this.autocomplete.addListener('place_changed', function () {
                that.props.onPlaceChanged(that.autocomplete.getPlace());
            });
        },

        componentDidUpdate: function () {
            this.autocomplete.setBounds(this.props.bounds);
        },

        render: function () {
            return (
                <div className="form-group">
                    <label className="control-label">{ this.props.label }</label>
                    <input className="form-control"
                            label={ this.props.label }
                            name={ this.props.name }
                            placeholder={ this.props.placeholder }
                            type="text"
                            value={ this.props.value }
                            ref="textbox"
                            onChange={ this.props.onChange } />
                </div>
            );
        }

    });

    return Autocomplete;

};
