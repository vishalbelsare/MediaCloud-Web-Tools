import React from 'react';
// import * as d3 from 'd3';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib';
import MenuItem from 'material-ui/MenuItem';
import { fetchQuerySentenceCounts, fetchDemoQuerySentenceCounts, updateTimestampForQueries, resetSentenceCounts } from '../../../actions/explorerActions';
import composeAsyncContainer from '../../common/AsyncContainer';
import composeDescribedDataCard from '../../common/DescribedDataCard';
import DataCard from '../../common/DataCard';
import AttentionOverTimeChart from '../../vis/AttentionOverTimeChart';
import { DownloadButton } from '../../common/IconButton';
import ActionMenu from '../../common/ActionMenu';
import { getUserRoles, hasPermissions, PERMISSION_LOGGED_IN } from '../../../lib/auth';
import { cleanDateCounts } from '../../../lib/dateUtil';
import { DEFAULT_SOURCES, DEFAULT_COLLECTION, queryPropertyHasChanged } from '../../../lib/explorerUtil';

const localMessages = {
  overallSeries: { id: 'explorer.attention.series.overall', defaultMessage: 'Whole Query' },
  lineChartTitle: { id: 'explorer.attention.lineChart.title', defaultMessage: 'Sentences Over Time' },
  descriptionIntro: { id: 'explorer.attention.lineChart.intro', defaultMessage: '<p>Compare the attention paid to your queries over time to understand how they are covered. This chart shows the number of sentences that match each of your queries. Spikes in attention can reveal key events. Plateaus can reveal stable, "normal", attention levels.</p>' },
  descriptionDetail: { id: 'explorer.attention.lineChart.detail', defaultMessage: '<p>This chart includes one line for each query in your search. Each line charts the average number of sentences that matched your query per day in the sources and collections you have specified.</p><p>Roll over the line chart to see the sentences per day in that period of time. Click the download button in the top right to download the raw counts in a CSV spreadsheet. Click the three lines in the top right of the chart to export the chart as an image file.</p>' },
  downloadCSV: { id: 'explorer.attention.downloadcsv', defaultMessage: 'Download {name}' },
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

class AttentionComparisonContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { urlQueryString, lastSearchTime, fetchData } = this.props;

    if (nextProps.lastSearchTime !== lastSearchTime ||
      (nextProps.urlQueryString && urlQueryString && nextProps.urlQueryString.pathname !== urlQueryString.pathname)) {
      fetchData(nextProps.urlQueryString, nextProps.queries);
    }
  }
  shouldComponentUpdate(nextProps) {
    const { results, queries } = this.props;
    // only re-render if results, any labels, or any colors have changed
    if (results.length) { // may have reset results so avoid test if results is empty
      const labelsHaveChanged = queryPropertyHasChanged(queries.slice(0, results.length), nextProps.queries.slice(0, results.length), 'label');
      const colorsHaveChanged = queryPropertyHasChanged(queries.slice(0, results.length), nextProps.queries.slice(0, results.length), 'color');
      return (
        ((labelsHaveChanged || colorsHaveChanged))
         || (results !== nextProps.results)
      );
    }
    return queries.length; // if both results and queries are empty, don't update
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
    const { results, queries } = this.props;
    const { formatMessage } = this.props.intl;
    // stich together bubble chart data

    // because these results are indexed, we can merge these two arrays
    // we may have more results than queries b/c queries can be deleted but not executed
    const mergedResultsWithQueryInfo = results.map((r, idx) => Object.assign({}, r, queries[idx]));

    // stich together line chart data
    let series = [];
    if (mergedResultsWithQueryInfo !== undefined && mergedResultsWithQueryInfo !== null && mergedResultsWithQueryInfo.length > 0) {
      series = [
        ...mergedResultsWithQueryInfo.map((query, idx) => {    // add series for all the results
          const data = dataAsSeries(cleanDateCounts(query.split));
          return {
            id: idx,
            name: query.label,
            data: data.values,
            pointStart: data.start,
            pointInterval: data.intervalMs,
            color: query.color,
          };
        }),
      ];
    }
    return (
      <div>
        <Row>
          <Col lg={12}>
            <DataCard>
              <div className="actions">
                <ActionMenu>
                  {mergedResultsWithQueryInfo.map((q, idx) =>
                    <MenuItem
                      key={idx}
                      className="action-icon-menu-item"
                      primaryText={formatMessage(localMessages.downloadCSV, { name: q.label })}
                      rightIcon={<DownloadButton />}
                      onTouchTap={() => this.downloadCsv(q)}
                    />
                  )}
                </ActionMenu>
              </div>
              <h2><FormattedMessage {...localMessages.lineChartTitle} /></h2>
              <AttentionOverTimeChart series={series} height={300} />
            </DataCard>
          </Col>
        </Row>
      </div>
    );
  }
}

AttentionComparisonContainer.propTypes = {
  // from parent
  lastSearchTime: React.PropTypes.number.isRequired,
  queries: React.PropTypes.array.isRequired,
  // from composition
  params: React.PropTypes.object.isRequired,
  intl: React.PropTypes.object.isRequired,
  // from dispatch
  fetchData: React.PropTypes.func.isRequired,
  recordLastSearchTime: React.PropTypes.func.isRequired,
  results: React.PropTypes.array.isRequired,
  urlQueryString: React.PropTypes.object.isRequired,
  // from mergeProps
  asyncFetch: React.PropTypes.func.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  lastSearchTime: state.explorer.lastSearchTime.time,
  user: state.user,
  urlQueryString: ownProps.params,
  fetchStatus: state.explorer.sentenceCount.fetchStatus,
  results: state.explorer.sentenceCount.results,
});

const mapDispatchToProps = (dispatch, state) => ({
  recordLastSearchTime: () => {
    dispatch(updateTimestampForQueries());
  },
  fetchData: (params, queries) => {
    // this should trigger when the user clicks the Search button or changes the URL
    // for n queries, run the dispatch with each parsed query

    const isLoggedInUser = hasPermissions(getUserRoles(state.user), PERMISSION_LOGGED_IN);
    dispatch(resetSentenceCounts()); // necessary if a query deletion has occurred

    if (isLoggedInUser) {
      state.queries.map((q) => {
        const infoToQuery = {
          start_date: q.startDate,
          end_date: q.endDate,
          q: q.q,
          index: q.index,
          sources: [DEFAULT_SOURCES],
          collections: [DEFAULT_COLLECTION],
        };
        return dispatch(fetchQuerySentenceCounts(infoToQuery));
      });
    } else if (queries || state.queries) { // else assume DEMO mode, but assume the queries have been loaded
      const runTheseQueries = queries || state.queries;
      // find queries on stack without id but with index and with q, and add?
      // hmm problem here b/c we already have it in here
      // const newQueries = state.queries.filter(q => q.id === null && q.index);
      // runTheseQueries = runTheseQueries.concat(newQueries);
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
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.recordLastSearchTime();
      dispatchProps.fetchData(ownProps, ownProps.queries);
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      composeDescribedDataCard(localMessages.descriptionIntro, [localMessages.descriptionDetail])(
        composeAsyncContainer(
          AttentionComparisonContainer
        )
      )
    )
  );
