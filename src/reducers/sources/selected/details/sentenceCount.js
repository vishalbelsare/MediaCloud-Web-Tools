import { createAsyncReducer } from '../../../../lib/reduxHelpers';
import { FETCH_SOURCE_SENTENCE_COUNT } from '../../../../actions/sourceActions';

function cleanDateCounts(counts) {
  return counts.map((d) => {
    const ymd = d.timespanStart.substr(0, 10).split('-');
    const dateObj = Date.UTC(ymd[0], ymd[1] - 1, ymd[2]);
    return { date: dateObj, count: d.sentenceCount };
  }).sort(function (a, b) {
    return a.date - b.date;
  });
}

function coverageGapsAsPlotBands(results) {
  let plotBands = [];
  if (results.coverage_gaps === 0) {
      return plotBands;
  }
  const gapList = results.coverage_gaps_list;
  for (let idx in gapList) {
    const entry = gapList[idx];
    const weekStart = Date.parse(entry.stat_week.substring(0, 10));
    const weekEnd = weekStart + 604800000;    // + one week
    plotBands.push({
      from: weekStart,
      to: weekEnd,
      color: 'rgba(255, 0, 0, .6)',
    });
  }
  return plotBands;
}

const sentenceCount = createAsyncReducer({
  initialState: {
    total: null,
    list: [],
  },
  action: FETCH_SOURCE_SENTENCE_COUNT,
  handleFetch: () => ({ list: [], total: null }),
  handleSuccess: (payload) => ({
    total: payload.results.sentenceCounts.length,
    list: cleanDateCounts(payload.results.sentenceCounts),
    health: coverageGapsAsPlotBands(payload.results.health),
  }),
  handleFailure: () => ({ list: [], total: null }),
});
export default sentenceCount;
