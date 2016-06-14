import { resolve, reject } from 'redux-simple-promise';
import { FETCH_SOURCE_SENTENCE_COUNT } from '../../../../actions/sourceActions.js';
import * as fetchConstants from '../../../../lib/fetchConstants.js';

const INITIAL_STATE = {
  fetchStatus: fetchConstants.FETCH_INVALID,
  total: null,
  list: [],
};

function sentenceCount(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_SOURCE_SENTENCE_COUNT:
      return Object.assign({}, state, {
        ...state,
        fetchStatus: fetchConstants.FETCH_ONGOING,
      });
    case resolve(FETCH_SOURCE_SENTENCE_COUNT):
      const cleanedCounts = action.payload.results.sentenceCounts.map((d) => {
        const ymd = d.timespanStart.substr(0, 10).split('-');
        const dateObj = new Date(Date.UTC(ymd[0], ymd[1] - 1, ymd[2]));
        return { date: dateObj, count: d.sentenceCount };
      });
      return Object.assign({}, state, {
        ...state,
        fetchStatus: fetchConstants.FETCH_SUCCEEDED,
        total: action.payload.results.sentenceCounts.length,
        list: cleanedCounts,
      });
    case reject(FETCH_SOURCE_SENTENCE_COUNT):
      return Object.assign({}, state, {
        ...state,
        fetchStatus: fetchConstants.FETCH_FAILED,
      });
    default:
      return state;
  }
}

export default sentenceCount;
