import { FETCH_TOPIC_TIMESPANS_LIST, TOGGLE_TIMESPAN_CONTROLS, SET_TIMESPAN_VISIBLE_PERIOD } from '../../../actions/topicActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';
import moment from 'moment';

function addJsDates(list) {
  return list.map((timespan) => ({
    ...timespan,
    startDateMoment: moment(timespan.start_date),
    endDateMoment: moment(timespan.end_date),
  }));
}

const timespans = createAsyncReducer({
  initialState: {
    list: [],
    isVisible: true,
    selectedPeriod: 'overall',
  },
  action: FETCH_TOPIC_TIMESPANS_LIST,
  handleSuccess: (payload) => ({
    list: addJsDates(payload.list),
  }),
  TOGGLE_TIMESPAN_CONTROLS: (payload) => ({ isVisible: payload }),
  SET_TIMESPAN_VISIBLE_PERIOD: (payload) => ({ selectedPeriod: payload }),
});

export default timespans;
