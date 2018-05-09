import { SET_COLLECTION_SOURCE_HISTORY_TIME_PERIOD, FETCH_COLLECTION_SOURCE_SPLIT_STORY_HISTORICAL_COUNTS } from '../../../../actions/sourceActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';
import { PAST_WEEK, cleanDateCounts } from '../../../../lib/dateUtil';

const historicalSentenceCounts = createAsyncReducer({
  initialState: {
    timePeriod: PAST_WEEK,
    counts: [],
  },
  action: FETCH_COLLECTION_SOURCE_SPLIT_STORY_HISTORICAL_COUNTS,
  [SET_COLLECTION_SOURCE_HISTORY_TIME_PERIOD]: payload => ({
    timePeriod: payload,
  }),
  handleSuccess: payload => ({
    counts: payload.counts.map(c => ({
      ...c,
      sentencesOverTime: cleanDateCounts(c.stories_over_time),
    })),
  }),
});

export default historicalSentenceCounts;
