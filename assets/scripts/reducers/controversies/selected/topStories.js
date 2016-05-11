import { resolve, reject } from 'redux-simple-promise';
import { FETCH_CONTROVERSY_TOP_STORIES } from '../../../actions/controversyActions';
import * as fetchConstants from '../../../lib/fetchConstants.js';

const INITIAL_STATE = {
  fetchStatus: fetchConstants.FETCH_INVALID,
};

function topStories(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_CONTROVERSY_TOP_STORIES:
      return Object.assign({}, state, {
        fetchStatus: fetchConstants.FETCH_ONGOING,
      });
    case resolve(FETCH_CONTROVERSY_TOP_STORIES):
      return Object.assign({}, state, {
        fetchStatus: fetchConstants.FETCH_SUCCEEDED,
        ...action.payload.results,
      });
    case reject(FETCH_CONTROVERSY_TOP_STORIES):
      return Object.assign({}, state, {
        fetchStatus: fetchConstants.FETCH_FAILED,
      });
    default:
      return state;
  }
}

export default topStories;
