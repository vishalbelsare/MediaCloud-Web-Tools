import { FETCH_MEDIAPICKER_SOURCE_SEARCH, MEDIA_PICKER_TOGGLE_MEDIA_IN_LIST, RESET_MEDIAPICKER_SOURCE_SEARCH } from '../../../actions/systemActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const sourceQueryResults = createAsyncReducer({
  initialState: {
    list: [],
  },
  action: FETCH_MEDIAPICKER_SOURCE_SEARCH,
  handleSuccess: (payload, state, meta) => ({
    args: Object.assign({}, meta.args[0], { selected: false }),
    list: payload.list.map(c => ({
      ...c,
      name: `${c.name}`,
      id: c.media_id,
      type: 'source',
      selected: false,
    })),
  }),
  [MEDIA_PICKER_TOGGLE_MEDIA_IN_LIST]: (payload, state) => ({
    list: state.list ? state.list.map((c) => {
      if (c.id === payload.id) {
        return ({
          ...c,
          selected: !c.selected,
        });
      }
      return c;
    }) : null,
  }),
  [RESET_MEDIAPICKER_SOURCE_SEARCH]: () => ({ list: [] }),
});

export default sourceQueryResults;
