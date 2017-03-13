import { FETCH_TOPIC_FOCAL_SET_SENTENCE_COUNTS, SET_ATTENTION_FOCAL_SET_ID } from '../../../actions/topicActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';
import { cleanDateCounts } from '../../../lib/dateUtil';

const attention = createAsyncReducer({
  initialState: {
    foci: [],
    selectedFocalSetId: '0',
  },
  action: FETCH_TOPIC_FOCAL_SET_SENTENCE_COUNTS,
  // on success we have to clean the split sentence counts for each focus
  handleSuccess: (payload) => {
    if (payload.foci !== null && payload.foci !== undefined && payload.foci.length > 0) {
      return {
        ...payload,
        foci: payload.foci.map(focus => ({
          ...focus,
          counts: cleanDateCounts(focus.sentence_counts.split),
          total: focus.sentence_counts.count,
        })),
      };
    }
    return { ...payload, foci: [] };
  },
  // save the current selected one
  [SET_ATTENTION_FOCAL_SET_ID]: payload => ({ selectedFocalSetId: payload }),
});

export default attention;
