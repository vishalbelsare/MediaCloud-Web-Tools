import { resolve, reject } from 'redux-simple-promise';
import { LIST_CONTROVERSIES } from './controversyActions';

const INITIAL_STATE = {
  meta: { isFetching: false },
  all: []
};

export default function isFetching(state = INITIAL_STATE, action) {
  switch (action.type) {

  case LIST_CONTROVERSIES:
    return Object.assign({}, state, {
      meta: { isFetching: true }
    });
  case resolve(LIST_CONTROVERSIES):
    return Object.assign({}, state, {
      meta: { isFetching: false },
      all: action.payload.results
    });
  case reject(LIST_CONTROVERSIES):
    return Object.assign({}, state, {
      meta: { isFetching: false }
    });

  default:
    return state;
  }
}
