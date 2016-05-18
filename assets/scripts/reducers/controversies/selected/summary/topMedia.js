import { resolve, reject } from 'redux-simple-promise';
import { FETCH_CONTROVERSY_TOP_MEDIA } from '../../../../actions/controversyActions';
import * as fetchConstants from '../../../../lib/fetchConstants.js';

const INITIAL_STATE = {
  fetchStatus: fetchConstants.FETCH_INVALID,
  sort: 'social',
  list: [],
};

function topMedia(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_CONTROVERSY_TOP_MEDIA:
      return Object.assign({}, state, {
        ...state,
        fetchStatus: fetchConstants.FETCH_ONGOING,
      });
    case resolve(FETCH_CONTROVERSY_TOP_MEDIA):
      return Object.assign({}, state, {
        ...state,
        fetchStatus: fetchConstants.FETCH_SUCCEEDED,
        list: action.payload.results,
      });
    case reject(FETCH_CONTROVERSY_TOP_MEDIA):
      return Object.assign({}, state, {
        ...state,
        fetchStatus: fetchConstants.FETCH_FAILED,
      });
    default:
      return state;
  }
}

export default topMedia;
