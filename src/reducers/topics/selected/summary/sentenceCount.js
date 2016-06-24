import { FETCH_TOPIC_SENTENCE_COUNT } from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

// Helper to change solr dates into javascript date ojects
function cleanDateCounts(countsMap) {
  const countsArray = [];
  for (const k in countsMap) {
    if (k === 'end' || k === 'gap' || k === 'start') continue;
    const v = countsMap[k];
    const ymd = k.substr(0, 10).split('-');
    const timestamp = Date.UTC(ymd[0], ymd[1] - 1, ymd[2]);
    countsArray.push({ date: timestamp, count: v });
  }
  return countsArray;
}

const sentenceCount = createAsyncReducer({
  initialState: {
    total: null,
    counts: [],
  },
  action: FETCH_TOPIC_SENTENCE_COUNT,
  handleSuccess: (payload) => ({
    total: payload.count,
    counts: cleanDateCounts(payload.split),
  }),
});

export default sentenceCount;
