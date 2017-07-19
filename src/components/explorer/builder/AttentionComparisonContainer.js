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
    const mergedResultsWithQueryInfo = results.map((r, idx) => Object.assign({}, r, queries[idx]));

    // stich together line chart data
    let series = [];
    if (mergedResultsWithQueryInfo !== undefined) {
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
  selected: React.PropTypes.object.isRequired,
  // from composition
  params: React.PropTypes.object.isRequired,
  intl: React.PropTypes.object.isRequired,
  // from dispatch
  fetchData: React.PropTypes.func.isRequired,
  recordLastSearchTime: React.PropTypes.func.isRequired,
  resetDisplay: React.PropTypes.func.isRequired,
  results: React.PropTypes.array.isRequired,
  urlQueryString: React.PropTypes.object.isRequired,
  sampleSearches: React.PropTypes.array, // TODO, could we get here without any sample searches? yes if logged in...
  // from mergeProps
  asyncFetch: React.PropTypes.func.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  lastSearchTime: state.explorer.lastSearchTime.time,
  selected: state.explorer.selected,
  user: state.user,
  urlQueryString: ownProps.params,
  fetchStatus: state.explorer.sentenceCount.fetchStatus,
  results: state.explorer.sentenceCount.results,
});

const mapDispatchToProps = (dispatch, state) => ({
  recordLastSearchTime: () => {
    dispatch(updateTimestampForQueries());
  },
  resetDisplay: () => {
    // dispatch(resetQueries());
    dispatch(resetSentenceCounts());
  },
  fetchData: (params, queries) => {
    // this should trigger when the user clicks the Search button or changes the URL
    // for n queries, run the dispatch with each parsed query

    const isLoggedInUser = hasPermissions(getUserRoles(state.user), PERMISSION_LOGGED_IN);

    if (isLoggedInUser) {
      /* const infoToQuery = {
      start_date: query.start_date,
      end_date: query.end_date,
      solr_seed_query: query.q,
      color: query.color,
    };
    if ('sourcesAndCollections' in query) {
      infoToQuery['sources[]'] = query.sourcesAndCollections.filter(s => s.media_id).map(s => s.media_id);
      infoToQuery['collections[]'] = query.sourcesAndCollections.filter(s => s.tags_id).map(s => s.tags_id);
    } else {
      infoToQuery['sources[]'] = '';
      infoToQuery['collections[]'] = '';
    }
    */
      if (params) { // specific change/update here
        dispatch(fetchQuerySentenceCounts());
      } else { // get all results
        state.queries.map((q, index) => dispatch(fetchQuerySentenceCounts(q, index)));
      }
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
