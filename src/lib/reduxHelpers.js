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
 * Helper for generating async actions (these are promise-based).  Provide two params:
 * - `type`: the action type constant
 * - `fetcher`: the function object to run (args will be relayed automatically)
 * This returns an action function you can use.
 */
export function createAsyncAction(type, fetcher) {
  return (...args) => ({
    type,
    payload: {
      promise: fetcher(...args),
    },
  });
}

/**
 * Helper to create a generic reducer.  Pass in an object with the following properties:
 * - `intialState`: the intial state to use for this recuder (default to empty object)
 * - `[OTHER_CONSTANTS]`: any other constants will be added as extra checks (this lets you include other actions in this reducer)
 */
export function createReducer(handlers) {
  // there might be intial state we need to set up
  let desiredInitialState = {};
  if ('initialState' in handlers) {
    desiredInitialState = handlers.initialState;
  }
  const initialState = {
    fetchStatus: fetchConstants.FETCH_INVALID,
    ...desiredInitialState,
  };
  // set up a lookup table for any things the user passed in
  const actionLookup = {};
  for (const key in handlers) {
    if (!['initialState'].includes(key)) {
      actionLookup[key] = handlers[key];
    }
  }
  // and now set up the reducer method
  return (state = initialState, action) => {
    if (action.type in actionLookup) {
      return Object.assign({}, state, {
        ...state,
        ...actionLookup[action.type](action.payload),
      });
    }
    return state;
  };
}

/**
 * Helper for generating generic async reducers.  Pass in an object with the following properties
 * (each is optional):
 * - `initialState`: the initial state for this reducer (defaults to empty object)
 * - `handleFetch`: any state to set when the action is first dispatched (defaults to empty)
 * - `handleSuccess`: any state to set when the async call returns successfully (defaults to `{...payload}`)
 * - `handleFailure`: any state to set when the action is first dispatched (defaults to empty)
 * - `[OTHER_CONSTANTS]`: any other constants will be added as extra checks (this lets you include other actions in this reducer)
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
  // there might be intial state we need to set up
  let desiredInitialState = {};
  if ('initialState' in handlers) {
    desiredInitialState = handlers.initialState;
  }
  const initialState = {
    fetchStatus: fetchConstants.FETCH_INVALID,
    ...desiredInitialState,
  };
  // set up any async reducer handlers the user passed in
  const reducers = {  // set up some smart defaults for normal behaviour
    handleFetch: () => ({}),
    handleSuccess: (payload) => ({ ...payload }),
    handleFailure: () => ({}),
  };
  for (const key in reducers) { // override defaults with custom methods passed in
    if (key in handlers) {
      reducers[key] = handlers[key];
    }
  }
  // set up a lookup table for any other things the user passed in
  const extraActionLookup = {};
  for (const key in handlers) {
    if (!['action', 'initialState', 'handleFetch', 'handleSuccess', 'handleFailure'].includes(key)) {
      extraActionLookup[key] = handlers[key];
    }
  }
  // now alter the state appropriately
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
        if (action.type in extraActionLookup) {
          return Object.assign({}, state, {
            ...state,
            ...extraActionLookup[action.type](action.payload),
          });
        }
        return state;
    }
  };
}
