import { FETCH_COLLECTION_SOURCES_BY_IDS, RESET_COLLECTIONS_BY_IDS } from '../../actions/sourceActions';
import { createAsyncReducer } from '../../lib/reduxHelpers';

const collectionSearch = createAsyncReducer({
  initialState: {
    list: [],
  },
  action: FETCH_COLLECTION_SOURCES_BY_IDS,
  handleSuccess: payload => ({
    // note these are the associated sources given an array of collection ids
    list: payload.results.map(c => ({ ...c, name: c.name, id: c.id, type: 'source' })),
  }),
  [RESET_COLLECTIONS_BY_IDS]: () => ({ list: [] }),
});

export default collectionSearch;
