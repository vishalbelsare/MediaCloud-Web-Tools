import { FETCH_FEATURED_COLLECTIONS_FOR_QUERY, MEDIA_PICKER_SELECT_MEDIA } from '../../../actions/systemActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const featured = createAsyncReducer({
  action: FETCH_FEATURED_COLLECTIONS_FOR_QUERY,
  handleSuccess: payload => ({
    list: payload.results.map(c => ({
      ...c,
      name: `${c.tag_set_label}: ${c.label || c.tag}`,
      id: c.tags_id,
      type: 'collection',
      selected: false, // for adding/removing from selected list
    })),
  }),
  [MEDIA_PICKER_SELECT_MEDIA]: (payload, state) => ({
    list: state.list ? state.list.map((c) => {
      if (c.id === payload.id) {
        return ({
          ...c,
          selected: !c.selected,
        });
      }
      return c;
    }) : null,
    timestamp: Date.now().toString(),
  }),
});
export default featured;
