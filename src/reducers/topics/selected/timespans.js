import { FETCH_TOPIC_TIMESPANS_LIST, TOGGLE_TIMESPAN_CONTROLS, SET_TIMESPAN_VISIBLE_PERIOD } from '../../../actions/topicActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const timespans = createAsyncReducer({
  initialState: {
    list: [],
    isVisible: true,
    selectedPeriod: 'overall',
  },
  action: FETCH_TOPIC_TIMESPANS_LIST,
  TOGGLE_TIMESPAN_CONTROLS: (payload) => ({ isVisible: payload }),
  SET_TIMESPAN_VISIBLE_PERIOD: (payload) => ({ selectedPeriod: payload }),
});

export default timespans;
