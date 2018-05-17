import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import MenuItem from 'material-ui/MenuItem';
import { fetchQuerySplitStoryCount, fetchDemoQuerySplitStoryCount, resetSentenceCounts, setSentenceDataPoint, resetSentenceDataPoint } from '../../../actions/explorerActions';
import composeAsyncContainer from '../../common/AsyncContainer';
import composeSummarizedVisualization from './SummarizedVizualization';
import AttentionOverTimeChart from '../../vis/AttentionOverTimeChart';
import { DownloadButton } from '../../common/IconButton';
import ActionMenu from '../../common/ActionMenu';
import { oneDayLater, solrFormat } from '../../../lib/dateUtil';
import { queryChangedEnoughToUpdate, postToDownloadUrl } from '../../../lib/explorerUtil';
import messages from '../../../resources/messages';
import { FETCH_INVALID } from '../../../lib/fetchConstants';

const localMessages = {
  overallSeries: { id: 'explorer.attention.series.overall', defaultMessage: 'Whole Query' },
  lineChartTitle: { id: 'explorer.attention.lineChart.title', defaultMessage: 'Attention Over Time' },
  descriptionIntro: { id: 'explorer.attention.lineChart.intro', defaultMessage: '<p>Compare the attention paid to your queries over time to understand how they are covered. This chart shows the number of stories that match each of your queries. Spikes in attention can reveal key events. Plateaus can reveal stable, "normal", attention levels. Click a point to see words and headlines for those dates.</p>' },
  descriptionDetail: { id: 'explorer.attention.lineChart.detail', defaultMessage: '<p>This chart includes one line for each query in your search. Each line charts the number of stories that matched your query per day in the sources and collections you have specified.</p><p>Roll over the line chart to see the stories per day in that period of time. Click the download button in the top right to download the raw counts in a CSV spreadsheet. Click the three lines in the top right of the chart to export the chart as an image file.</p>' },
  withKeywords: { id: 'explorer.attention.mode.withkeywords', defaultMessage: 'View Story Count (default)' },
  withoutKeywords: { id: 'explorer.attention.mode.withoutkeywords', defaultMessage: 'View Normalized Story Count' },

};

const VIEW_NORMALIZED = 'VIEW_NORMALIZED';
const VIEW_REGULAR = 'VIEW_REGULAR';

class QueryAttentionOverTimeResultsContainer extends React.Component {
  state = {
    isDrillDownVisible: false,
    dateRange: null,
    clickedQuery: null,
    view: VIEW_REGULAR, // which view to show (see view constants above)
  }

  componentWillReceiveProps(nextProps) {
    const { lastSearchTime, fetchData } = this.props;
    if (nextProps.lastSearchTime !== lastSearchTime) {
      fetchData(nextProps.queries);
    }
  }
  shouldComponentUpdate(nextProps) {
    const { results, queries } = this.props;
    return queryChangedEnoughToUpdate(queries, nextProps.queries, results, nextProps.results);
  }

  setView = (nextView) => {
    this.setState({ view: nextView });
  }

  handleDataPointClick = (date0, date1, evt, origin) => {
    const { selectDataPoint, queries } = this.props;
    const name = origin.series.name;
    const currentQueryOfInterest = queries.filter(qry => qry.label === name)[0];
    const dayGap = 1; // TODO: harcoded for now because we are always showing daily results
    // date calculations for span/range
    const clickedQuery = {
      q: currentQueryOfInterest.q,
      start_date: solrFormat(date1),
      color: origin.series.color,
      dayGap,
    };
    clickedQuery.end_date = solrFormat(oneDayLater(date1), true);
    this.setState({ clickedQuery });
    selectDataPoint(clickedQuery);
  }
  downloadCsv = (query) => {
    postToDownloadUrl('/api/explorer/stories/split-count.csv', query);
  }
  render() {
    const { results, queries } = this.props;
    const { formatMessage } = this.props.intl;
    // stich together bubble chart data

    // because these results are indexed, we can merge these two arrays
    // we may have more results than queries b/c queries can be deleted but not executed
    // so we have to do the following
    const safeResults = results.map((r, idx) => Object.assign({}, r, queries[idx]));
    // stich together line chart data
    let series = [];
    if (safeResults && safeResults.length > 0) {
      series = [
        ...safeResults.map((query, idx) => {    // add series for all the results
          if (query.counts || query.normalizedCounts) {
            return {
              id: idx,
              name: query.label,
              data: this.state.view === VIEW_NORMALIZED ? query.normalizedCounts.map(d => [d.date, d.count]) : query.counts.map(d => [d.date, d.count]),
              color: query.color,
            };
          } return {};
        }),
      ];
    }
    const viewOptions = [
      <span key={'temp'}>
        <MenuItem
          className="action-icon-menu-item"
          primaryText={formatMessage(localMessages.withoutKeywords)}
          disabled={this.state.view === VIEW_NORMALIZED}
          onTouchTap={() => this.setView(VIEW_NORMALIZED)}
        />
        <MenuItem
          className="action-icon-menu-item"
          primaryText={formatMessage(localMessages.withKeywords)}
          disabled={this.state.view === VIEW_REGULAR}
          onTouchTap={() => this.setView(VIEW_REGULAR)}
        />
      </span>,
    ];
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
            {safeResults.map((q, idx) =>
              <MenuItem
                key={idx}
                className="action-icon-menu-item"
                primaryText={formatMessage(messages.downloadDataCsv, { name: q.label })}
                rightIcon={<DownloadButton />}
                onTouchTap={() => this.downloadCsv(q)}
              />
            )}
          </ActionMenu>
          <ActionMenu actionTextMsg={messages.viewOptions}>
            {viewOptions}
          </ActionMenu>
        </div>
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
  daySpread: PropTypes.bool,
  // from mergeProps
  asyncFetch: PropTypes.func.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  selectDataPoint: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  lastSearchTime: state.explorer.lastSearchTime.time,
  fetchStatus: state.explorer.storySplitCount.fetchStatus || FETCH_INVALID,
  results: state.explorer.storySplitCount.results,
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
        return dispatch(fetchQuerySplitStoryCount(infoToQuery));
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
        return dispatch(fetchDemoQuerySplitStoryCount(demoInfo));
      });
    }
  },
  selectDataPoint: (clickedDataPoint) => {
    dispatch(resetSentenceDataPoint());
    dispatch(setSentenceDataPoint(clickedDataPoint));
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
