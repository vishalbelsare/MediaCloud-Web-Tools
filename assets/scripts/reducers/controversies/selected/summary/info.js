import { resolve, reject } from 'redux-simple-promise';
import { FETCH_CONTROVERSY_SUMMARY } from '../../../../actions/controversyActions';
import * as fetchConstants from '../../../../lib/fetchConstants.js';

const INITIAL_STATE = {
  fetchStatus: fetchConstants.FETCH_INVALID,
};

function info(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_CONTROVERSY_SUMMARY:
      return Object.assign({}, state, {
        fetchStatus: fetchConstants.FETCH_ONGOING,
      });
    case resolve(FETCH_CONTROVERSY_SUMMARY):
      return Object.assign({}, state, {
        fetchStatus: fetchConstants.FETCH_SUCCEEDED,
        ...action.payload.results,
      });
    case reject(FETCH_CONTROVERSY_SUMMARY):
      return Object.assign({}, state, {
        fetchStatus: fetchConstants.FETCH_FAILED,
      });
    default:
      return state;
  }
}

export default info;
