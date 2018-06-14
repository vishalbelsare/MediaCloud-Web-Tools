import { SET_COLLECTION_SOURCE_HISTORY_TIME_PERIOD, FETCH_COLLECTION_SOURCE_SPLIT_STORY_HISTORICAL_COUNTS } from '../../../../actions/sourceActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';
import { PAST_WEEK, cleanDateCounts } from '../../../../lib/dateUtil';

const historicalSentenceCounts = createAsyncReducer({
  initialState: {
    timePeriod: PAST_WEEK,
    total: 0,
    list: [],
  },
  action: FETCH_COLLECTION_SOURCE_SPLIT_STORY_HISTORICAL_COUNTS,
  handleSuccess: payload => ({
    counts: payload.counts.map(c => ({
      ...c,
      total: c.total_stories, // or calcl total_split_stories??
      storiesOverTime: cleanDateCounts(c.splits_over_time),
    })),
  }),
  [SET_COLLECTION_SOURCE_HISTORY_TIME_PERIOD]: payload => ({
    timePeriod: payload,
  }),
});

export default historicalSentenceCounts;
