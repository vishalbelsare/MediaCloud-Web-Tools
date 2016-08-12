import { TOPIC_FILTER_BY_SNAPSHOT, TOPIC_FILTER_BY_TIMESPAN } from '../../../actions/topicActions';
import { createReducer } from '../../../lib/reduxHelpers';

const info = createReducer({
  initialState: {
    snapshotId: null,
    timespanId: null,
    fociId: null,
  },
  TOPIC_FILTER_BY_SNAPSHOT: (payload) => ({
    snapshotId: parseInt(payload, 10),
    timespanId: null,
    fociId: null,
  }),
  TOPIC_FILTER_BY_TIMESPAN: (payload) => ({
    timespanId: parseInt(payload, 10),
  }),
});

export default info;
