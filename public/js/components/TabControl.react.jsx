
module.exports = (function () {
    'use strict';

    var React = require('react')
      , Col = require('react-bootstrap').Col
      , Row = require('react-bootstrap').Row
      , Link = require('react-router').Link
      , _ = require('underscore')._;

    var TabControl = React.createClass({

        render: function () {
            return (
                <div className="tab-control">
                    <Row className="tab-control-header">
                        { this.headerComponents() }
                    </Row>

                    { this.props.children }
                </div>
            );
        },

        headerComponents: function () {
            var that = this
              , columnSize = this.props.iconColSize || 1
              , HeaderComponentTemplate = this.props.headerComponent;

            return _.map(this.props.headerComponentProps, function (props, index) {
                return (
                    <Col xs={ columnSize } sm={ columnSize } md={ columnSize }>
                        <HeaderComponentTemplate {...props} />
                    </Col>
                );
            });
        }

    });

    return TabControl;

})();
