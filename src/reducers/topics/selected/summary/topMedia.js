import { FETCH_TOPIC_TOP_MEDIA, SORT_TOPIC_TOP_MEDIA } from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const topMedia = createAsyncReducer({
  initialState: {
    sort: 'inlink',
    media: [],
  },
  action: FETCH_TOPIC_TOP_MEDIA,
  [SORT_TOPIC_TOP_MEDIA]: payload => ({ sort: payload }),
});

export default topMedia;
