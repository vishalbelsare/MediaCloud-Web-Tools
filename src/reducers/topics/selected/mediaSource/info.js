import { FETCH_MEDIA, SELECT_MEDIA } from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const TAG_SET_COLLECTIONS_ID = 5;

const info = createAsyncReducer({
  initialState: {
    id: null,
    collections: [],
  },
  action: FETCH_MEDIA,
  SELECT_MEDIA: (payload) => ({ id: payload }),
  handleSuccess: (payload) => ({
    ...payload,
    collections: payload.media_source_tags.filter(tag =>
      (tag.tag_sets_id === TAG_SET_COLLECTIONS_ID) && (tag.show_on_media === 1)
    ),
  }),
});

export default info;
