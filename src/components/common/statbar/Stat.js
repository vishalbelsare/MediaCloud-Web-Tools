import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Col } from 'react-flexbox-grid/lib';
import DataCard from '../DataCard';

const Stat = props => (
  <Col lg={4}>
    <DataCard>
      <div className="stat">
        <small><FormattedMessage {...props.message} /></small>
        <em>{props.data}</em>
      </div>
    </DataCard>
  </Col>
);

Stat.propTypes = {
  // from parent
  message: React.PropTypes.object.isRequired,
  data: React.PropTypes.string.isRequired,
  // from context
  intl: React.PropTypes.object.isRequired,
};

export default
  injectIntl(
    Stat
  );
