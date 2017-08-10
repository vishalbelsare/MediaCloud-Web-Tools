import { FETCH_MEDIAPICKER_SOURCE_SEARCH, RESET_MEDIAPICKER_SOURCE_SEARCH } from '../../../actions/systemActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const sourceQueryResults = createAsyncReducer({
  initialState: {
    list: [],
  },
  action: FETCH_MEDIAPICKER_SOURCE_SEARCH,
  handleSuccess: (payload, state, meta) => ({
    args: meta.args[0],
    list: payload.list.map(c => ({
      ...c,
      name: `${c.name}`,
      id: c.media_id,
      type: 'source',
    })),
  }),
  [RESET_MEDIAPICKER_SOURCE_SEARCH]: () => ({ list: [] }),
});

export default sourceQueryResults;
