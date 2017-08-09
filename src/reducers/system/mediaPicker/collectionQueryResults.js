import { FETCH_MEDIAPICKER_COLLECTION_SEARCH, RESET_MEDIAPICKER_COLLECTION_SEARCH } from '../../../actions/explorerActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const collectionSearch = createAsyncReducer({
  initialState: {
    list: [],
  },
  action: FETCH_MEDIAPICKER_COLLECTION_SEARCH,
  handleSuccess: (payload, state, meta) => ({
    args: meta.args[0],
    list: payload.list.map(c => ({
      ...c,
      name: `${c.tag_set_label}: ${c.label || c.tag}`,
      id: c.tags_id,
      type: 'collection',
    })),
  }),
  [RESET_MEDIAPICKER_COLLECTION_SEARCH]: () => ({ list: [] }),
});

export default collectionSearch;
