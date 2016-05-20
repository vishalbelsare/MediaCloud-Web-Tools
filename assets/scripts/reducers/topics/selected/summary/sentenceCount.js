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
      return Object.assign({}, state, {
        ...state,
        fetchStatus: fetchConstants.FETCH_SUCCEEDED,
        total: action.payload.results.total,
        list: action.payload.results.counts,
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
