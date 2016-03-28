import { resolve, reject } from 'redux-simple-promise';
import { FETCH_CONTROVERSY_LIST, FETCH_CONTROVERSY_SUMMARY } from './controversyActions';

export const FETCH_CONTROVERSY_LIST_INVALID = 'FETCH_CONTROVERSY_LIST_INVALID';
export const FETCH_CONTROVERSY_LIST_ONGOING = 'FETCH_CONTROVERSY_LIST_ONGOING';
export const FETCH_CONTROVERSY_LIST_SUCCEEDED = 'FETCH_CONTROVERSY_LIST_SUCCEEDED';
export const FETCH_CONTROVERSY_LIST_FAILED = 'FETCH_CONTROVERSY_LIST_FAILED';

export const FETCH_CONTROVERSY_SUMMARY_INVALID = 'FETCH_CONTROVERSY_SUMMARY_INVALID';
export const FETCH_CONTROVERSY_SUMMARY_ONGOING = 'FETCH_CONTROVERSY_SUMMARY_ONGOING';
export const FETCH_CONTROVERSY_SUMMARY_SUCCEEDED = 'FETCH_CONTROVERSY_SUMMARY_SUCCEEDED';
export const FETCH_CONTROVERSY_SUMMARY_FAILED = 'FETCH_CONTROVERSY_SUMMARY_FAILED';

const INITIAL_STATE = {
  meta: { fetchListState: FETCH_CONTROVERSY_LIST_INVALID,
          fetchSummaryState: FETCH_CONTROVERSY_SUMMARY_INVALID },
  selected: null,
  all: {}
};

export default function controversies(state = INITIAL_STATE, action) {
  switch (action.type) {

  case FETCH_CONTROVERSY_LIST:
    return Object.assign({}, state, {
      meta: { fetchListState: FETCH_CONTROVERSY_LIST_ONGOING }
    });
  case resolve(FETCH_CONTROVERSY_LIST):
    return Object.assign({}, state, {
      meta: { fetchListState: FETCH_CONTROVERSY_LIST_SUCCEEDED },
      all: arrayToDict(action.payload.results,'controversies_id')
    });
  case reject(FETCH_CONTROVERSY_LIST):
    return Object.assign({}, state, {
      meta: { fetchListState: FETCH_CONTROVERSY_LIST_FAILED }
    });

  case FETCH_CONTROVERSY_SUMMARY:
    return Object.assign({}, state, {
      meta: { fetchSummaryState: FETCH_CONTROVERSY_SUMMARY_ONGOING }
    });
  case resolve(FETCH_CONTROVERSY_SUMMARY):
    const controversy_id = action.payload.results['controversies_id'];
    state.all[controversy_id] = action.payload.results;
    return Object.assign({}, state, {
      meta: { fetchSummaryState: FETCH_CONTROVERSY_SUMMARY_SUCCEEDED },
      selected: action.payload.results['controversies_id']
    });
  case reject(FETCH_CONTROVERSY_SUMMARY):
    return Object.assign({}, state, {
      meta: { fetchSummaryState: FETCH_CONTROVERSY_SUMMARY_FAILED }
    });

  default:
    return state;
  }
}

function arrayToDict(arr,keyPropertyName){
  let dict = {};
  arr.forEach( (item) => {
    dict[item[keyPropertyName]] = item;
  });
  return dict;
}