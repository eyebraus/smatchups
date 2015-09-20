
module.exports = (function () {
    'use strict';

    var React = require('react')
      , Col = require('react-bootstrap').Col
      , Row = require('react-bootstrap').Row
      , Router = require('react-router')
      , RouteHandler = Router.RouteHandler;

    var LinkedIconButton = require('./LinkedIconButton.react.jsx')
      , ToggleImageButton = require('./ToggleImageButton.react.jsx');

    var BeaconsSection = React.createClass({

        getInitialState: function () {
            return {
                isSmash64Enabled: false,
                isMeleeEnabled: true,
                isProjectMEnabled: false,
                isSm4shEnabled: false
            };
        },
        
        onToggledFactory: function (keyName) {
            var that = this;

            return function (toggleState) {
                var newState = {};
                newState[keyName] = toggleState;

                that.setState(newState);
            };
        },

        render: function () {
            return (
                <Row>
                    <Col xs={ 12 } sm={ 12 } md={ 12 } className="beacons-section-wrapper">
                        <Row className="beacons-section-filters">
                            <Col xs={ 2 } sm={ 2 } md={ 2 }>
                                <ToggleImageButton
                                        imageUrl="/app/img/icon/smash-64-toggle.png"
                                        imageWidth="24"
                                        imageHeight="24"
                                        toggleState={ this.state.isSmash64Enabled }
                                        onToggled={ this.onToggledFactory('isSmash64Enabled') } />
                            </Col>

                            <Col xs={ 2 } sm={ 2 } md={ 2 }>
                                <ToggleImageButton
                                        imageUrl="/app/img/icon/melee-toggle.png"
                                        imageWidth="24"
                                        imageHeight="24"
                                        toggleState={ this.state.isMeleeEnabled }
                                        onToggled={ this.onToggledFactory('isMeleeEnabled') } />
                            </Col>

                            <Col xs={ 2 } sm={ 2 } md={ 2 }>
                                <ToggleImageButton
                                        imageUrl="/app/img/icon/project-m-toggle.png"
                                        imageWidth="24"
                                        imageHeight="24"
                                        toggleState={ this.state.isProjectMEnabled }
                                        onToggled={ this.onToggledFactory('isProjectMEnabled') } />
                            </Col>

                            <Col xs={ 2 } sm={ 2 } md={ 2 }>
                                <ToggleImageButton
                                        imageUrl="/app/img/icon/sm4sh-toggle.png"
                                        imageWidth="24"
                                        imageHeight="24"
                                        toggleState={ this.state.isSm4shEnabled }
                                        onToggled={ this.onToggledFactory('isSm4shEnabled') } />
                            </Col>

                            <Col xs={ 3 } xsOffset={ 1 } sm={ 3 } smOffset={ 1 } md={ 3 } mdOffset={ 1 }>
                                <LinkedIconButton
                                        iconSize="fa-3"
                                        iconType="fa-plus"
                                        routeName="create-beacon" />
                            </Col>
                        </Row>

                        <Row className="beacons-section">
                            <Col xs={ 12 } sm={ 12 } md={ 12 }>
                                <RouteHandler />
                            </Col>

                            <Col xs={ 6 } sm={ 6 } md={ 6 } className="beacons-section-toggle-mode">
                                <LinkedIconButton
                                        iconSize="fa-3"
                                        iconType="fa-list"
                                        routeName="beacons-list" />
                            </Col>

                            <Col xs={ 6 } sm={ 6 } md={ 6 } className="beacons-section-toggle-mode">
                                <LinkedIconButton
                                        iconSize="fa-3"
                                        iconType="fa-globe"
                                        routeName="beacons-map" />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            );
        }

    });

    return BeaconsSection;

})();
