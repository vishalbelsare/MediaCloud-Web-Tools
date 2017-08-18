import { UPDATE_QUERY, UPDATE_QUERY_COLLECTION_LOOKUP_INFO, UPDATE_QUERY_SOURCE_LOOKUP_INFO, ADD_CUSTOM_QUERY, SELECT_SEARCH_BY_ID, SELECT_SEARCH_BY_PARAMS, RESET_QUERIES } from '../../../actions/explorerActions';

const INITIAL_STATE = [];

function queries(state = INITIAL_STATE, action) {
  let updatedState = null;
  let queryIndex = -1;
  switch (action.type) {
    case ADD_CUSTOM_QUERY:
      updatedState = [...state];
      updatedState.push(action.payload);
      return updatedState;
    case UPDATE_QUERY:
      if (action.payload) { // just for safety
        updatedState = [...state];
        queryIndex = state.findIndex(q => q.index !== null && q.index === action.payload.index);
        // we may not have an id if this is a custom query, use index. -- update we may not even use ID... TBD
        queryIndex = queryIndex > -1 ? queryIndex : action.payload.index;
        updatedState[queryIndex] = action.payload;
        return updatedState;
      }
      return null;
    case UPDATE_QUERY_SOURCE_LOOKUP_INFO:
      if (action.payload) { // just for safety
        updatedState = [...state];
        queryIndex = state.findIndex(q => q.index !== null && q.index === action.payload.index);
        // we may not have an id if this is a custom query, use index. -- update we may not even use ID... TBD
        queryIndex = queryIndex > -1 ? queryIndex : action.payload.index;
        updatedState[queryIndex].sources = action.payload.sources;
        return updatedState;
      }
      return null;
    case UPDATE_QUERY_COLLECTION_LOOKUP_INFO:
      if (action.payload) { // just for safety
        updatedState = [...state];
        queryIndex = state.findIndex(q => q.index !== null && q.index === action.payload.index);
        // we may not have an id if this is a custom query, use index. -- update we may not even use ID... TBD
        queryIndex = queryIndex > -1 ? queryIndex : action.payload.index;
        updatedState[queryIndex].collections = action.payload.collections;
        return updatedState;
      }
      return null;
    case SELECT_SEARCH_BY_ID:
      if (action.payload) { // make sure searchId is set if present in return results. use index to differentiate queries.
        const queryData = action.payload.queries.map((q, idx) => Object.assign({}, q, { searchId: action.payload.id, id: idx, index: idx }));
        updatedState = queryData;
        return updatedState;
      }
      return state;
    case SELECT_SEARCH_BY_PARAMS: // select this set of queries as passed in by URL
      if (action.payload) { // searchId will not be present as this was a keyword search... index should be set on front end when parsing JSON keywords
        const queryData = action.payload.map(q => Object.assign({}, q, { id: null, searchId: null }));
        return queryData;
      }
      return state;
    case RESET_QUERIES:
      return INITIAL_STATE;
    default:
      return state;
  }
}

export default queries;
