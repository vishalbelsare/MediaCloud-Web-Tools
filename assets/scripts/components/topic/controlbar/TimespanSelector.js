import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../resources/messages';

const TimespanSelector = (props) => {
  const { timespans, selectedId, onTimespanSelected } = props;
  return (
    <div>
      <FormattedMessage {...messages.topicTimespan} />
      <select defaultValue={selectedId} onChange={onTimespanSelected}>
        {timespans.map(timespan =>
          <option key={timespan.controversy_dump_time_slices_id}
            value={timespan.controversy_dump_time_slices_id}
          >
            {timespan.start_date.substr(0, 10)} to {timespan.end_date.substr(0, 10)}
          </option>
        )}
      </select>
    </div>
  );
};

TimespanSelector.propTypes = {
  timespans: React.PropTypes.array.isRequired,
  selectedId: React.PropTypes.number,
  intl: React.PropTypes.object.isRequired,
  onTimespanSelected: React.PropTypes.func,
};

export default injectIntl(TimespanSelector);
