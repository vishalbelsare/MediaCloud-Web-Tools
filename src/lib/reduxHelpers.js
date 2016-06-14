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

/**
 * Helper for generating generic async reducers.  Pass in an object with the following properties
 * (each is optional):
 * - `initialState`: the initial state for this reducer (defaults to empty)
 * - `handleFetch`: any state to set when the action is first dispatched (defaults to initialState)
 * - `handleSuccess`: any state to set when the async call returns successfully (defaults to `{...payload}`)
 * - `handleFailure`: any state to set when the action is first dispatched (defaults to initialState)
 * This handles setting the fetchState to the appropriate item from `fetchConstants` for you. So you can
 * write reducers like this and they will act like you'd expect:
 * ```es6
 * const topWords = createAsyncReducer({
 *  initialState: {
 *    list: [],
 *  },
 *  action: FETCH_TOPIC_TOP_WORDS,
 * });
 * ```
 */
export function createAsyncReducer(handlers) {
  let desiredInitialState = {};
  if (handlers.hasOwnProperty('initialState')) {
    desiredInitialState = handlers.initialState;
  }
  const initialState = {
    fetchStatus: fetchConstants.FETCH_INVALID,
    ...desiredInitialState,
  };
  const reducers = {  // set up some smart defaults for normal behaviour
    handleFetch: () => (desiredInitialState),
    handleSuccess: (payload) => ({ ...payload }),
    handleFailure: () => (desiredInitialState),
  };
  for (const key in reducers) { // override defaults with custom methods passed in
    if (handlers.hasOwnProperty(key)) {
      reducers[key] = handlers[key];
    }
  }
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
