import { FETCH_COLLECTIONS_BY_IDS, RESET_COLLECTIONS_BY_IDS } from '../../actions/sourceActions';
import { createAsyncReducer } from '../../lib/reduxHelpers';

const collectionSearch = createAsyncReducer({
  initialState: {
    list: [],
  },
  action: FETCH_COLLECTIONS_BY_IDS,
  handleSuccess: payload => ({
    // add name and id so we can display it in an autocomplete
    list: payload.results.map(c => ({ ...c, name: c.name, id: c.tags_id, type: 'collection' })),
  }),
  [RESET_COLLECTIONS_BY_IDS]: () => ({ list: [] }),
});

export default collectionSearch;
