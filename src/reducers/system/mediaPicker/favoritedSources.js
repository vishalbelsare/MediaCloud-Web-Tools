import { FETCH_FAVORITE_SOURCES, MEDIA_PICKER_TOGGLE_MEDIA_IN_LIST } from '../../../actions/systemActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const favoritedSources = createAsyncReducer({
  initialState: {
    list: [],
  },
  action: FETCH_FAVORITE_SOURCES,
  handleSuccess: (payload, state, meta) => ({
    args: Object.assign({}, meta.args[0], { selected: false }),
    list: payload.list.map(c => ({
      ...c,
      name: `${c.name}`,
      id: parseInt(c.media_id, 10),
      type: 'source',
      selected: false,
    })),
  }),
  [MEDIA_PICKER_TOGGLE_MEDIA_IN_LIST]: (payload, state) => {
    const updatedState = [...state.list];
    const mediaIndex = updatedState.findIndex(q => q.id !== null && q.id === payload.selectedMedia.id);
    if (mediaIndex >= 0) {
      updatedState[mediaIndex].selected = payload.setSelected;
    }
    return { list: updatedState };
  },
});

export default favoritedSources;
