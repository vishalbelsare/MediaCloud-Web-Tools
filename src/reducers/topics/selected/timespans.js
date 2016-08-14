import { FETCH_TOPIC_TIMESPANS_LIST, TOGGLE_TIMESPAN_CONTROLS, 
  SET_TIMESPAN_VISIBLE_PERIOD, TOPIC_FILTER_BY_TIMESPAN } from '../../../actions/topicActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';
import moment from 'moment';

function addJsDates(list) {
  return list.map((timespan) => ({
    ...timespan,
    startDateMoment: moment(timespan.start_date),
    endDateMoment: moment(timespan.end_date),
    startDateObj: moment(timespan.start_date).toDate(),
    endDateObj: moment(timespan.end_date).toDate(),
  }));
}

function getTimespanFromListById(list, id) {
  for (const idx in list) {
    if (list[idx].timespans_id === id) {
      return list[idx];
    }
  }
  return null;
}

const timespans = createAsyncReducer({
  initialState: {
    list: [],
    isVisible: false,
    selectedPeriod: 'overall',
    selectedId: null, // annoying that I have to keep this here too... topic.filters should be the one true source of this info :-(
    selected: null,
  },
  action: FETCH_TOPIC_TIMESPANS_LIST,
  handleSuccess: (payload, state) => {
    // this needs to update the selected info, in case the seleceted id came from the url
    const list = addJsDates(payload.list);
    const selected = getTimespanFromListById(list, state.selectedId);
    return { list, selected };
  },
  TOGGLE_TIMESPAN_CONTROLS: (payload) => ({ isVisible: payload }),
  SET_TIMESPAN_VISIBLE_PERIOD: (payload) => ({ selectedPeriod: payload }),
  TOPIC_FILTER_BY_TIMESPAN: (payload, state) => {
    const selectedId = parseInt(payload, 10);
    // this might fail, in the case where the id comes from the url, before we have fetched the list
    const selected = getTimespanFromListById(state.list, selectedId);
    return { selectedId, selected };
  },
});

export default timespans;
