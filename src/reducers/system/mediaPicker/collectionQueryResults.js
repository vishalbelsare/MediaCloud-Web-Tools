import { FETCH_MEDIAPICKER_COLLECTION_SEARCH, MEDIA_PICKER_TOGGLE_MEDIA_IN_LIST, RESET_MEDIAPICKER_COLLECTION_SEARCH } from '../../../actions/systemActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const collectionSearch = createAsyncReducer({
  initialState: {
    list: [],
  },
  action: FETCH_MEDIAPICKER_COLLECTION_SEARCH,
  handleSuccess: (payload, state, meta) => ({
    args: Object.assign({}, meta.args[0], { selected: false }), // for adding/removing from selected list
    list: payload.list.map(c => ({
      ...c,
      name: `${c.tag_set_label}: ${c.label || c.tag}`,
      id: c.tags_id,
      type: 'collection',
      selected: false,
    })),
  }),
  [MEDIA_PICKER_TOGGLE_MEDIA_IN_LIST]: (payload, state) => ({
    list: state.list.map((c) => {
      if (c.id === payload.id) {
        return ({
          ...c,
          selected: !c.selected,
        });
      }
      return c;
    }),
  }),
  [RESET_MEDIAPICKER_COLLECTION_SEARCH]: () => ({ list: [] }),
});

export default collectionSearch;
