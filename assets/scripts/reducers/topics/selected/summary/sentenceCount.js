import { resolve, reject } from 'redux-simple-promise';
import { FETCH_TOPIC_SENTENCE_COUNT } from '../../../../actions/topicActions';
import * as fetchConstants from '../../../../lib/fetchConstants.js';

const INITIAL_STATE = {
  fetchStatus: fetchConstants.FETCH_INVALID,
  total: null,
  list: [],
};

function sentenceCount(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_TOPIC_SENTENCE_COUNT:
      return Object.assign({}, state, {
        ...state,
        fetchStatus: fetchConstants.FETCH_ONGOING,
      });
    case resolve(FETCH_TOPIC_SENTENCE_COUNT):
      const cleanedCounts = action.payload.results.counts.map((d) => {
        const ymd = d.date.substr(0, 10).split('-');
        const dateObj = new Date(Date.UTC(ymd[0], ymd[1] - 1, ymd[2]));
        return { date: dateObj, count: d.count };
      });
      return Object.assign({}, state, {
        ...state,
        fetchStatus: fetchConstants.FETCH_SUCCEEDED,
        total: action.payload.results.total,
        list: cleanedCounts,
      });
    case reject(FETCH_TOPIC_SENTENCE_COUNT):
      return Object.assign({}, state, {
        ...state,
        fetchStatus: fetchConstants.FETCH_FAILED,
      });
    default:
      return state;
  }
}

export default sentenceCount;
