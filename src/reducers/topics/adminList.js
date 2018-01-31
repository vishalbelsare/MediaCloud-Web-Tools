import { FETCH_ADMIN_TOPIC_LIST } from '../../actions/topicActions';
import { createAsyncReducer } from '../../lib/reduxHelpers';

const adminList = createAsyncReducer({
  initialState: {
    topics: [],
  },
  action: FETCH_ADMIN_TOPIC_LIST,
  handleSuccess: payload => ({
    ...payload,
    topics: payload.topics.map((t) => {
      // mark the ones that are "exceeded stories" - these are noise
      const updatedTopic = { ...t };
      if (t.state === 'error') {
        if (t.message.includes('solr_seed_query returned more than') || t.message.includes('which exceeds topic max stories')) {
          updatedTopic.state = 'error (too big)';
        }
      }
      return updatedTopic;
    }),
  }),
});

export default adminList;
