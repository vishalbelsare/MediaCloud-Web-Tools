import { FETCH_FEATURED_COLLECTIONS_FOR_QUERY, MEDIA_PICKER_TOGGLE_MEDIA_IN_LIST } from '../../../actions/systemActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const featured = createAsyncReducer({
  action: FETCH_FEATURED_COLLECTIONS_FOR_QUERY,
  handleSuccess: (payload, state, meta) => ({
    args: Object.assign({}, meta.args[0], { selected: false }), // for adding/removing from selected list
    list: payload.results.map(c => ({
      ...c,
      name: `${c.label || c.tag}`,
      id: c.tags_id,
      type: 'collection',
      selected: false, // for adding/removing from selected list
    })),
  }),
  [MEDIA_PICKER_TOGGLE_MEDIA_IN_LIST]: (payload, state) => {
    const updatedState = [...state.list];
    const mediaIndex = updatedState.findIndex(q => q.id !== null && q.id === payload.selectedMedia.id);
    updatedState[mediaIndex].selected = payload.setSelected;
    return { list: updatedState };
  },
});
export default featured;
