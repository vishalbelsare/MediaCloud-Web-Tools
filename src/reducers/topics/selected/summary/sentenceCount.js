import { FETCH_TOPIC_SENTENCE_COUNT } from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

function cleanDateCounts(counts) {
  return counts.map((d) => {
    const ymd = d.date.substr(0, 10).split('-');
    const dateObj = new Date(Date.UTC(ymd[0], ymd[1] - 1, ymd[2]));
    return { date: dateObj, count: d.count };
  });
}

const sentenceCount = createAsyncReducer({
  initialState: {
    total: null,
    list: [],
  },
  action: FETCH_TOPIC_SENTENCE_COUNT,
  handleFetch: () => ({ list: [], total: null }),
  handleSuccess: (payload) => ({
    total: payload.results.total,
    list: cleanDateCounts(payload.results.counts),
  }),
  handleFailure: () => ({ list: [], total: null }),
});

export default sentenceCount;
