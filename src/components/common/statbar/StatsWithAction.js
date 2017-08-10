import PropTypes from 'prop-types';
import React from 'react';
import { Row, Col } from 'react-flexbox-grid/lib';
import Stat from './Stat';
import AppButton from '../AppButton';

const StatsWithAction = props => (
  <Row>
    <Col lg={props.columnWidth || 3}>
      <Stat columnWidth={props.columnWidth} {...props.statProps.stat1} />
    </Col>
    <Col lg={props.columnWidth || 3}>
      <Stat columnWidth={props.columnWidth} {...props.statProps.stat2} />
    </Col>
    <Col lg={props.columnWidth || 3}>
      <AppButton
        label="test" // the toggle has to be implemented
        disabled={props.statProps.selected}
        onTouchTap={props.onClick}
      />
    </Col>

  </Row>
);

StatsWithAction.propTypes = {
  // from parent
  statProps: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  columnWidth: PropTypes.number,
};

export default
  StatsWithAction;
