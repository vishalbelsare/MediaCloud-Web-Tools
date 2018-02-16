import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import MenuItem from 'material-ui/MenuItem';
import { fetchQuerySentenceCounts, fetchDemoQuerySentenceCounts, resetSentenceCounts, fetchQueryPerDateTopWords, fetchDemoQueryPerDateTopWords, fetchQueryPerDateSampleStories, fetchDemoQueryPerDateSampleStories } from '../../../actions/explorerActions';
import composeAsyncContainer from '../../common/AsyncContainer';
import composeSummarizedVisualization from './SummarizedVizualization';
import AttentionOverTimeChart from '../../vis/AttentionOverTimeChart';
import { DownloadButton } from '../../common/IconButton';
import { QueryAttentionOverTimeDrillDownDataCard } from './QueryAttentionOverTimeDrillDownDataCard';
import ActionMenu from '../../common/ActionMenu';
import { cleanDateCounts, oneWeekLater, solrFormat } from '../../../lib/dateUtil';
import { queryPropertyHasChanged } from '../../../lib/explorerUtil';
import messages from '../../../resources/messages';

const localMessages = {
  overallSeries: { id: 'explorer.attention.series.overall', defaultMessage: 'Whole Query' },
  lineChartTitle: { id: 'explorer.attention.lineChart.title', defaultMessage: 'Attention Over Time' },
  descriptionIntro: { id: 'explorer.attention.lineChart.intro', defaultMessage: '<p>Compare the attention paid to your queries over time to understand how they are covered. This chart shows the number of sentences that match each of your queries. Spikes in attention can reveal key events. Plateaus can reveal stable, "normal", attention levels.</p>' },
  descriptionDetail: { id: 'explorer.attention.lineChart.detail', defaultMessage: '<p>This chart includes one line for each query in your search. Each line charts the average number of sentences that matched your query per day in the sources and collections you have specified.</p><p>Roll over the line chart to see the sentences per day in that period of time. Click the download button in the top right to download the raw counts in a CSV spreadsheet. Click the three lines in the top right of the chart to export the chart as an image file.</p>' },
  details: { id: 'explorer.attention.drillDown.details', defaultMessage: 'Here are some details about what was reported on for {date}' },
  sampleStories: { id: 'explorer.attention.drillDown.sampleStories', defaultMessage: 'Sample Stories for {date}' },
  topWords: { id: 'explorer.attention.drillDown.topWords', defaultMessage: 'Top Words for {date}' },
};

const SECS_PER_DAY = 1000 * 60 * 60 * 24;

function dataAsSeries(data) {
  // clean up the data
  const dates = data.map(d => d.date);
  // turning variable time unit into days
  const intervalMs = (dates[1] - dates[0]);
  const intervalDays = intervalMs / SECS_PER_DAY;
  const values = data.map(d => Math.round(d.count / intervalDays));
  return { values, intervalMs, start: dates[0] };
}

class QueryAttentionOverTimeResultsContainer extends React.Component {
  state = {
    isDrillDownVisible: false,
    dateRange: null,
    clickedQuery: null,
  }
  componentWillReceiveProps(nextProps) {
    const { lastSearchTime, fetchData } = this.props;
    if (nextProps.lastSearchTime !== lastSearchTime) {
      fetchData(nextProps.queries);
    }
  }
  shouldComponentUpdate(nextProps) {
    const { results, queries, stories, words } = this.props;
    // only re-render if results, any labels, or any colors have changed
    if (results.length) { // may have reset results so avoid test if results is empty
      const labelsHaveChanged = queryPropertyHasChanged(queries.slice(0, results.length), nextProps.queries.slice(0, results.length), 'label');
      const colorsHaveChanged = queryPropertyHasChanged(queries.slice(0, results.length), nextProps.queries.slice(0, results.length), 'color');
      return (
        ((labelsHaveChanged || colorsHaveChanged))
        || (results !== nextProps.results)
        || (nextProps.stories !== stories
        || nextProps.words !== words)
      );
    }
    return false; // if both results and queries are empty, don't update
  }
  handleDataPointClick = (date0, date1, evt, origin) => {
    const { fetchStories, fetchWords } = this.props;
    const q = origin.series.name;
    const dayGap = false; // origin.series.options.dateRangeSpread;
    // date calculations for span/range
    const clickedQuery = {
      q,
      start_date: solrFormat(date0),
    };
    if (!dayGap) {
      clickedQuery.end_date = solrFormat(oneWeekLater(date0), true);
    }
    this.setState({ isDrillDownVisible: true, clickedQuery });

    fetchStories(clickedQuery);
    fetchWords(clickedQuery);
  }
  downloadCsv = (query) => {
    let url = null;
    if (parseInt(query.searchId, 10) >= 0) {
      url = `/api/explorer/sentences/count.csv/${query.searchId}/${query.index}`;
    } else {
      url = `/api/explorer/sentences/count.csv/[{"q":"${query.q}"}]/${query.index}`;
    }
    window.location = url;
  }
  render() {
    const { results, queries, words, stories } = this.props;
    const { formatMessage } = this.props.intl;
    // stich together bubble chart data

    // because these results are indexed, we can merge these two arrays
    // we may have more results than queries b/c queries can be deleted but not executed
    // so we have to do the following
    const mergedResultsWithQueryInfo = results.map((r, idx) => Object.assign({}, r, queries[idx]));

    let drillDown = null;
    if (this.state.isDrillDownVisible) {
      drillDown = (
        <QueryAttentionOverTimeDrillDownDataCard info={this.state.clickedQuery} words={words} stories={stories} />
      );
    }

    // stich together line chart data
    let series = [];
    if (mergedResultsWithQueryInfo !== undefined && mergedResultsWithQueryInfo !== null && mergedResultsWithQueryInfo.length > 0) {
      series = [
        ...mergedResultsWithQueryInfo.map((query, idx) => {    // add series for all the results
          if (query.split) {
            const data = dataAsSeries(cleanDateCounts(query.split));
            return {
              id: idx,
              name: query.label,
              data: data ? data.values : null,
              pointStart: data.start,
              pointInterval: data.intervalMs,
              color: query.color,
              dateRangeSpread: query.dateRangeSpread,
            };
          } return {};
        }),
      ];
    }
    return (
      <div>
        <AttentionOverTimeChart
          series={series}
          height={300}
          backgroundColor="#f5f5f5"
          onDataPointClick={this.handleDataPointClick}
        />
        <div className="actions">
          <ActionMenu actionTextMsg={messages.downloadOptions}>
            {mergedResultsWithQueryInfo.map((q, idx) =>
              <MenuItem
                key={idx}
                className="action-icon-menu-item"
                primaryText={formatMessage(messages.downloadDataCsv, { name: q.label })}
                rightIcon={<DownloadButton />}
                onTouchTap={() => this.downloadCsv(q)}
              />
            )}
          </ActionMenu>
        </div>
        {drillDown}
      </div>
    );
  }
}

QueryAttentionOverTimeResultsContainer.propTypes = {
  // from parent
  lastSearchTime: PropTypes.number.isRequired,
  queries: PropTypes.array.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  // from composition
  intl: PropTypes.object.isRequired,
  // from dispatch
  fetchData: PropTypes.func.isRequired,
  results: PropTypes.array.isRequired,
  fetchStories: PropTypes.func.isRequired,
  fetchWords: PropTypes.func.isRequired,
  words: PropTypes.array,
  stories: PropTypes.object,
  daySpread: PropTypes.bool,
  // from mergeProps
  asyncFetch: PropTypes.func.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  lastSearchTime: state.explorer.lastSearchTime.time,
  fetchStatus: state.explorer.sentenceCount.fetchStatus,
  results: state.explorer.sentenceCount.results,
  words: state.explorer.topWordsPerDateRange.list,
  stories: state.explorer.storiesPerDateRange,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (queries) => {
    // this should trigger when the user clicks the Search button or changes the URL
    // for n queries, run the dispatch with each parsed query
    dispatch(resetSentenceCounts()); // necessary if a query deletion has occurred
    if (ownProps.isLoggedIn) {
      const runTheseQueries = queries || ownProps.queries;
      runTheseQueries.map((q) => {
        const infoToQuery = {
          start_date: q.startDate,
          end_date: q.endDate,
          q: q.q,
          index: q.index,
          sources: q.sources.map(s => s.id),
          collections: q.collections.map(c => c.id),
        };
        return dispatch(fetchQuerySentenceCounts(infoToQuery));
      });
    } else if (queries || ownProps.queries) { // else assume DEMO mode, but assume the queries have been loaded
      const runTheseQueries = queries || ownProps.queries;
      runTheseQueries.map((q, index) => {
        const demoInfo = {
          index, // should be same as q.index btw
          search_id: q.searchId, // may or may not have these
          query_id: q.id, // could be undefined
          q: q.q, // only if no query id, means demo user added a keyword
        };
        return dispatch(fetchDemoQuerySentenceCounts(demoInfo));
      });
    }
  },
  fetchStories: (clickedQuery) => {
    if (ownProps.isLoggedIn) {
      dispatch(fetchQueryPerDateSampleStories({ ...clickedQuery }));
    } else {
      dispatch(fetchDemoQueryPerDateSampleStories(clickedQuery));
    }
  },
  fetchWords: (clickedQuery) => {
    if (ownProps.isLoggedIn) {
      dispatch(fetchQueryPerDateTopWords({ ...clickedQuery }));
    } else {
      dispatch(fetchDemoQueryPerDateTopWords(clickedQuery));
    }
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(ownProps.queries);
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      composeSummarizedVisualization(localMessages.lineChartTitle, localMessages.descriptionIntro, localMessages.descriptionDetail)(
        composeAsyncContainer(
          QueryAttentionOverTimeResultsContainer
        )
      )
    )
  );
