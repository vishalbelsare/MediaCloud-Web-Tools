import { FETCH_SOURCE_BY_METADATA, SELECT_ADVANCED_SEARCH_SOURCE, RESET_ADVANCED_SEARCH_SOURCE } from '../../../actions/sourceActions';
import { selectItemInArray, createAsyncReducer } from '../../../lib/reduxHelpers';
import * as fetchConstants from '../../../lib/fetchConstants';

const sourcesByMetadata = createAsyncReducer({
  initialState: {
    results: null,
    total: 0,
  },
  action: FETCH_SOURCE_BY_METADATA,
  handleSuccess: payload => ({
    list: payload.list.map(c => ({ ...c, selected: false })),
    total: payload.list.length,
  }),
  [SELECT_ADVANCED_SEARCH_SOURCE]: (payload, state) => ({
    // if media ids aren't passed in, this means select all items in the array
    // note, not sure how to do this for paged results
    total: payload.ids.length,
    list: selectItemInArray(state.list, payload.ids.length > 0 ? payload.ids : state.list.map(c => c.media_id), 'media_id', payload.checked),

  }),
  [RESET_ADVANCED_SEARCH_SOURCE]: () => ({
    fetchStatus: fetchConstants.FETCH_SUCCEEDED,
    list: [] }),
});

export default sourcesByMetadata;
