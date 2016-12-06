import { FETCH_COLLECTIONS_BY_IDS } from '../../actions/sourceActions';
import { createAsyncReducer } from '../../lib/reduxHelpers';

const collectionSearch = createAsyncReducer({
  initialState: {
    list: [],
  },
  action: FETCH_COLLECTIONS_BY_IDS,
  handleSuccess: payload => ({
    // add name and id so we can display it in an autocomplete
    list: payload.list.map(c => ({ ...c, name: c.label, id: c.tags_id, type: 'collection' })),
  }),
});

export default collectionSearch;
