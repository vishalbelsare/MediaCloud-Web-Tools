import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../../resources/messages';

const TimespanCollapsed = (props) => {
  const { timespan, onExpand } = props;
  return (
    <div>
      {timespan.start_date.substr(0, 10)} to {timespan.end_date.substr(0, 10)}
      <a href="#" onClick={onExpand}>Show Timeline</a>
    </div>
  );
};

TimespanCollapsed.propTypes = {
  timespan: React.PropTypes.object.isRequired,
  onExpand: React.PropTypes.func.isRequired,
};

export default injectIntl(TimespanCollapsed);
