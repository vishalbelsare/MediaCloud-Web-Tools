import PropTypes from 'prop-types';
import React from 'react';
import { FormattedDate, FormattedMessage, injectIntl } from 'react-intl';

const localMessages = {
  range: { id: 'timespan.range', defaultMessage: '{start} to {end}' },
};

const TimespanDateRange = props => (
  <span className="timespan-range">
    <FormattedMessage
      {...localMessages.range}
      values={{
        start: <FormattedDate value={props.timespan.startDateObj} month="short" year="numeric" day="numeric" />,
        end: <FormattedDate value={props.timespan.endDateObj} month="short" year="numeric" day="numeric" />,
      }}
    />
  </span>
);


TimespanDateRange.propTypes = {
  // from chain
  intl: PropTypes.object.isRequired,
  // from parent
  timespan: PropTypes.object.isRequired,
};

export default injectIntl(TimespanDateRange);
