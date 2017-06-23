// import { createReducer } from '../../../lib/reduxHelpers';
import { UPDATE_QUERY, ADD_CUSTOM_QUERY, SELECT_SEARCH_BY_ID, SELECT_SEARCH_BY_PARAMS } from '../../../actions/explorerActions';

const INITIAL_STATE = null;

// TODO review with RB
function queries(state = INITIAL_STATE, action) {
  let updatedState = null;
  switch (action.type) {
    case ADD_CUSTOM_QUERY:
      updatedState = [...state];
      updatedState.push(action.payload);
      return updatedState;
    case UPDATE_QUERY:
      if (action.payload) { // just for safety
        updatedState = [...state];
        let queryIndex = state.findIndex(q => q.id === action.payload.id);
        // we may not have an id if this is a custom query, use index. -- update we may not even use ID... TBD
        queryIndex = queryIndex > -1 ? queryIndex : action.payload.index;
        updatedState[queryIndex] = action.payload;
        return updatedState;
      }
      return null;
    case SELECT_SEARCH_BY_ID:
      if (action.payload) { // we may not have query id for these stored queries. use index which will not change for the sample queries
        const queryData = action.payload.data.map((q, idx) => Object.assign({}, q, { id: idx, index: idx, searchId: action.payload.searchId }));
        updatedState = queryData;
        return updatedState;
      }
      return state;
    case SELECT_SEARCH_BY_PARAMS:
      if (action.payload) {
        const queryData = action.payload.data.map(q => Object.assign({}, q, { id: null, searchId: null }));
        updatedState = queryData;
        return updatedState;
      }
      return state;
    default:
      return state;
  }
}

export default queries;
