import { resolve, reject } from 'redux-simple-promise';
import * as fetchConstants from './fetchConstants.js';

// TODO: replace this with normalizr? https://github.com/gaearon/normalizr
export function arrayToDict(arr, keyPropertyName) {
  const dict = {};
  arr.forEach((item) => {
    dict[item[keyPropertyName]] = item;
  });
  return dict;
}

export function createAsyncReducer(handlers) {
  const initialState = {
    fetchStatus: fetchConstants.FETCH_INVALID,
    ...handlers.initialState,
  };
  const reducers = {};
  const asyncCallbackNames = ['handleFetch', 'handleSuccess', 'handleFetch'];
  asyncCallbackNames.forEach((name) => {
    if (handlers.hasOwnProperty(name)) {
      reducers[name] = handlers[name];
    } else {
      reducers[name] = () => ({});
    }
  });
  return (state = initialState, action) => {
    switch (action.type) {
      case handlers.action:
        return Object.assign({}, state, {
          ...state,
          fetchStatus: fetchConstants.FETCH_ONGOING,
          ...reducers.handleFetch(action.payload),
        });
      case resolve(handlers.action):
        return Object.assign({}, state, {
          ...state,
          fetchStatus: fetchConstants.FETCH_SUCCEEDED,
          ...reducers.handleSuccess(action.payload),
        });
      case reject(handlers.action):
        return Object.assign({}, state, {
          ...state,
          fetchStatus: fetchConstants.FETCH_FAILED,
          ...reducers.handleFailure(action.payload),
        });
      default:
        return state;
    }
  };
}
