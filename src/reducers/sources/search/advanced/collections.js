import { FETCH_COLLECTION_BY_METADATA, SELECT_ADVANCED_SEARCH_COLLECTION, RESET_ADVANCED_SEARCH_COLLECTION } from '../../../../actions/sourceActions';
import { selectItemInArray, createAsyncReducer } from '../../../../lib/reduxHelpers';
import * as fetchConstants from '../../../../lib/fetchConstants';

const collectionsByMetadata = createAsyncReducer({
  initialState: {
    results: null,
  },
  action: FETCH_COLLECTION_BY_METADATA,
  handleSuccess: payload => ({
    list: payload.list,
    total: payload.list.length,
  }),
  [SELECT_ADVANCED_SEARCH_COLLECTION]: (payload, state) => ({
    // if the second argument is empty, this means we select all the items in the array
    // note, not sure how to do this for paged results
    total: payload.ids.length,
    list: selectItemInArray(state.list, payload.ids.length > 0 ? payload.ids : state.list.map(c => c.tags_id), 'tags_id', payload.checked),
  }),
  [RESET_ADVANCED_SEARCH_COLLECTION]: () => ({
    fetchStatus: fetchConstants.FETCH_SUCCEEDED,
    list: [] }),
});

export default collectionsByMetadata;
