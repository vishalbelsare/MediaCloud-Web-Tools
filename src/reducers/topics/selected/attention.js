import { FETCH_TOPIC_FOCAL_SET_SPLIT_STORY_COUNTS, SET_ATTENTION_FOCAL_SET_ID } from '../../../actions/topicActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';
import { cleanDateCounts } from '../../../lib/dateUtil';
import { NO_FOCAL_SET_SELECTED } from '../../../components/topic/attention/FocusSetSelectorContainer';

const attention = createAsyncReducer({
  initialState: {
    foci: [],
    selectedFocalSetId: NO_FOCAL_SET_SELECTED,
  },
  action: FETCH_TOPIC_FOCAL_SET_SPLIT_STORY_COUNTS,
  // on success we have to clean the split sentence counts for each focus
  handleSuccess: (payload) => {
    if (payload.foci !== null && payload.foci !== undefined && payload.foci.length > 0) {
      return {
        ...payload,
        foci: payload.foci.map(focus => ({
          ...focus,
          focal_sets_id: parseInt(focus.focal_sets_id, 10),
          counts: cleanDateCounts(focus.split_story_counts.counts),
          total: focus.split_story_counts.total_story_count,
        })),
        selectedFocalSetId: payload.foci.length > 0 ? payload.foci[0].focal_sets_id : NO_FOCAL_SET_SELECTED,
      };
    }
    return { ...payload, foci: [] };
  },
  // save the current selected one
  [SET_ATTENTION_FOCAL_SET_ID]: payload => ({ selectedFocalSetId: payload }),
});

export default attention;
