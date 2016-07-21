import { FETCH_TOPIC_INFLUENTIAL_MEDIA, SORT_TOPIC_INFLUENTIAL_MEDIA } from '../../../actions/topicActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const influentialMedia = createAsyncReducer({
  initialState: {
    media: [],
    link_ids: {},
    sort: 'social',
  },
  action: FETCH_TOPIC_INFLUENTIAL_MEDIA,
  SORT_TOPIC_INFLUENTIAL_MEDIA: (payload) => ({ sort: payload }),
});

export default influentialMedia;
