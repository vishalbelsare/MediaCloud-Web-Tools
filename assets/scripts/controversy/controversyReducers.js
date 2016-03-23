import { resolve, reject } from 'redux-simple-promise';
import { LIST_CONTROVERSIES } from './controversyActions';

export const FETCH_NONE = 'NONE';
export const FETCH_ONGOING = 'ONGOING';
export const FETCH_SUCCEEDED = 'SUCCEEDED';
export const FETCH_FAILED = 'FAILED';

const INITIAL_STATE = {
  meta: { fetchState: FETCH_NONE },
  all: []
};

export default function isFetching(state = INITIAL_STATE, action) {
  switch (action.type) {

  case LIST_CONTROVERSIES:
    return Object.assign({}, state, {
      meta: { fetchState: FETCH_ONGOING }
    });
  case resolve(LIST_CONTROVERSIES):
    return Object.assign({}, state, {
      meta: { fetchState: FETCH_SUCCEEDED },
      all: action.payload.results
    });
  case reject(LIST_CONTROVERSIES):
    return Object.assign({}, state, {
      meta: { fetchState: FETCH_FAILED }
    });

  default:
    return state;
  }
}
