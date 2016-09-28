// import { TOPIC_FILTER_BY_SNAPSHOT, TOPIC_FILTER_BY_TIMESPAN, TOPIC_FILTER_BY_FOCUS } from '../../../actions/topicActions';
import { createReducer } from '../../../lib/reduxHelpers';

function parseId(potentialId) {
  return (isNaN(potentialId) || potentialId === null) ? null : parseInt(potentialId, 10);
}

const info = createReducer({
  initialState: {
    snapshotId: null,
    timespanId: null,
    focusId: null,
  },
  TOPIC_FILTER_BY_SNAPSHOT: payload => ({
    snapshotId: parseId(payload),
    timespanId: null,
    focusId: null,
  }),
  TOPIC_FILTER_BY_FOCUS: payload => ({
    focusId: parseId(payload),
  }),
  TOPIC_FILTER_BY_TIMESPAN: payload => ({
    timespanId: parseId(payload),
  }),
});

export default info;
