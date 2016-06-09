import { resolve, reject } from 'redux-simple-promise';
import { FETCH_SOURCE_COLLECTION_LIST } from '../../actions/sourceActions';

import * as fetchConstants from '../../lib/fetchConstants.js';

// TODO: replace this with normalizr? https://github.com/gaearon/normalizr
function arrayToDict(arr, keyPropertyName) {
  const dict = {};
  arr.forEach((item) => {
    dict[item[keyPropertyName]] = item;
  });
  return dict;
}

const INITIAL_STATE = {
  fetchStatus: fetchConstants.FETCH_INVALID,
  list: {},
};

function all(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_SOURCE_COLLECTION_LIST:
      return Object.assign({}, state, {
        ...state,
        fetchStatus: fetchConstants.FETCH_ONGOING,
        list: {},
      });
    case resolve(FETCH_SOURCE_COLLECTION_LIST):
      return Object.assign({}, state, {
        ...state,
        fetchStatus: fetchConstants.FETCH_SUCCEEDED,
        list: arrayToDict(action.payload.results, 'tag_sets_id'),
      });
    case reject(FETCH_SOURCE_COLLECTION_LIST):
      return Object.assign({}, state, {
        ...state,
        fetchStatus: fetchConstants.FETCH_FAILED,
        list: {},
      });
    default:
      return state;
  }
}

export default all;
