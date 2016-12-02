import { FETCH_SOURCE_BY_METADATA, SELECT_ADVANCED_SEARCH_SOURCE } from '../../../actions/sourceActions';
import { selectItemInArray, createAsyncReducer } from '../../../lib/reduxHelpers';

const sourcesByMetadata = createAsyncReducer({
  initialState: {
    results: null,
  },
  action: FETCH_SOURCE_BY_METADATA,
  handleSuccess: payload => ({
    results: payload.results,
  }),
  [SELECT_ADVANCED_SEARCH_SOURCE]: payload => ({
    results: selectItemInArray(payload.args[0], payload.args[1], 'media_id'),
  }),
});

export default sourcesByMetadata;
