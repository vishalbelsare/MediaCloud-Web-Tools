import { FETCH_SOURCE_SEARCH } from '../../actions/sourceActions';
import { createAsyncReducer } from '../../lib/reduxHelpers';

const sourceSearch = createAsyncReducer({
  initialState: {
    list: [],
  },
  action: FETCH_SOURCE_SEARCH,
  handleSuccess: payload => ({
    // add name and id so we can display it in an autocomplete
    list: payload.list.map(m => ({ ...m, id: m.media_id, type: 'mediaSource' })),
  }),
});

export default sourceSearch;
