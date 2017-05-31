import React from 'react';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import Stat from './Stat';

const StatBar = props => (
  <Row>
    {props.stats.map(stat => (
      <Col lg={props.columnWidth || 4} key={stat.message.id}>
        <Stat columnWidth={props.columnWidth} {...stat} />
      </Col>
    ))}
  </Row>
);

StatBar.propTypes = {
  // from parent
  stats: React.PropTypes.array.isRequired,
  className: React.PropTypes.string,
  columnWidth: React.PropTypes.number,
  // from context
  intl: React.PropTypes.object.isRequired,
};

export default
  injectIntl(
    StatBar
  );
