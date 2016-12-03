import { FETCH_COLLECTION_BY_METADATA, SELECT_ADVANCED_SEARCH_COLLECTION } from '../../../actions/sourceActions';
import { selectItemInArray, createAsyncReducer } from '../../../lib/reduxHelpers';

const collectionsByMetadata = createAsyncReducer({
  initialState: {
    results: null,
  },
  action: FETCH_COLLECTION_BY_METADATA,
  handleSuccess: payload => ({
    results: payload.results,
  }),
  [SELECT_ADVANCED_SEARCH_COLLECTION]: payload => ({
    list: selectItemInArray(payload.args[0], payload.args[1], 'tags_id'),
  }),
});

export default collectionsByMetadata;
