import { TOPIC_FILTER_BY_SNAPSHOT, TOPIC_FILTER_BY_TIMESPAN, TOPIC_FILTER_BY_FOCUS } 
  from '../../../actions/topicActions';
import { createReducer } from '../../../lib/reduxHelpers';

const info = createReducer({
  initialState: {
    snapshotId: null,
    timespanId: null,
    focusId: null,
  },
  TOPIC_FILTER_BY_SNAPSHOT: (payload) => ({
    snapshotId: (isNaN(payload)) ? null : parseInt(payload, 10),
    timespanId: null,
    focusId: null,
  }),
  TOPIC_FILTER_BY_TIMESPAN: (payload) => ({
    timespanId: (isNaN(payload)) ? null : parseInt(payload, 10),
  }),
  TOPIC_FILTER_BY_FOCUS: (payload) => ({
    focusId: (isNaN(payload)) ? null : parseInt(payload, 10),
  }),
});

export default info;
