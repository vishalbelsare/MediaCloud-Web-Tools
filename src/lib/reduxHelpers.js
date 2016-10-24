import { resolve, reject } from 'redux-simple-promise';
import * as fetchConstants from './fetchConstants';
import { updateFeedback } from '../actions/appActions';

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
      args,  // tack on arguments pass in so we can access them directly in a reducer
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
  Object.keys(handlers).forEach((key) => {
    if (!['initialState'].includes(key)) {
      actionLookup[key] = handlers[key];
    }
  });
  // and now set up the reducer method
  return (state = initialState, action) => {
    if (action.type in actionLookup) {
      return Object.assign({}, state, {
        ...state,
        ...actionLookup[action.type](action.payload, state),
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
    handleSuccess: payload => ({ ...payload }),
    handleFailure: () => ({}),
  };
  Object.keys(reducers).forEach((key) => {   // override defaults with custom methods passed in
    if (key in handlers) {
      reducers[key] = handlers[key];
    }
  });
  // set up a lookup table for any other things the user passed in
  const extraActionLookup = {};
  Object.keys(handlers).forEach((key) => {
    if (!['action', 'initialState', 'handleFetch', 'handleSuccess', 'handleFailure'].includes(key)) {
      extraActionLookup[key] = handlers[key];
    }
  });
  // now alter the state appropriately
  return (state = initialState, action) => {
    switch (action.type) {
      case handlers.action:
        return Object.assign({}, state, {
          ...state,
          fetchStatus: fetchConstants.FETCH_ONGOING,
          ...reducers.handleFetch(action.payload, state),
        });
      case resolve(handlers.action):
        return Object.assign({}, state, {
          ...state,
          fetchStatus: fetchConstants.FETCH_SUCCEEDED,
          ...reducers.handleSuccess(action.payload, state),
        });
      case reject(handlers.action):
        return Object.assign({}, state, {
          ...state,
          fetchStatus: fetchConstants.FETCH_FAILED,
          ...reducers.handleFailure(action.payload, state),
        });
      default:
        if (action.type in extraActionLookup) {
          return Object.assign({}, state, {
            ...state,
            ...extraActionLookup[action.type](action.payload, state),
          });
        }
        return state;
    }
  };
}

/**
 * Report failures to user via app-level feedback mechanism.
 */
export function errorReportingMiddleware({ dispatch }) {
  return next => (action) => {
    let message = null;
    if (action.type.endsWith('_RESOLVED') || action.type.endsWith('_REJECTED')) {
      if ('status' in action.payload) {
        if (action.payload.status !== 200) {
          message = 'Sorry, we had an error';
          if ('message' in action.payload) {
            message = action.payload.message;
          }
        }
      }
    }
    if (message !== null) {
      dispatch(updateFeedback({ open: true, message }));
    }
    return next(action);  // Call the next dispatch method in the middleware chain.
  };
}
