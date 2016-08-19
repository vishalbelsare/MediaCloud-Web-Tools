import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';

const localMessages = {
  showTimespans: { id: 'showTimespans', defaultMessage: 'Show Timespans' },
};

const TimespanCollapsed = (props) => {
  const { timespan, onExpand } = props;
  const { formatMessage } = props.intl;
  return (
    <Grid>
      <Row>
        <Col lg={2} md={2} sm={0} />
        <Col lg={8} md={8} sm={6} className="center">
          {timespan.start_date.substr(0, 10)} to {timespan.end_date.substr(0, 10)}
        </Col>
        <Col lg={2} md={2} sm={6} >
          <a href={`#${formatMessage(localMessages.showTimespans)}`} className="toggle-control" onClick={onExpand}>
            <FormattedMessage {...localMessages.showTimespans} />
          </a>
        </Col>
      </Row>
    </Grid>
  );
};

TimespanCollapsed.propTypes = {
  intl: React.PropTypes.object.isRequired,
  timespan: React.PropTypes.object.isRequired,
  onExpand: React.PropTypes.func.isRequired,
};

export default injectIntl(TimespanCollapsed);
