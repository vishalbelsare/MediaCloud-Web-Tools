import { FETCH_TOPIC_TIMESPANS_LIST } from '../../../actions/topicActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const timespans = createAsyncReducer({
  initialState: {
    list: [],
    isVisible: true,
    selectedTab: 'custom',
  },
  action: FETCH_TOPIC_TIMESPANS_LIST,
  TOGGLE_TIMESPAN_CONTROLS: (payload) => ({ isVisible: payload }),
});

export default timespans;
