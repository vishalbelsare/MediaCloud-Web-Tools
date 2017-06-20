import React from 'react';
import * as d3 from 'd3';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib';
import { fetchQuerySentenceCounts, fetchDemoQuerySentenceCounts } from '../../../actions/explorerActions';
import { asyncContainerize } from '../../common/AsyncContainer';
import DataCard from '../../common/DataCard';
import AttentionOverTimeChart from '../../vis/AttentionOverTimeChart';
import { DownloadButton } from '../../common/IconButton';
import messages from '../../../resources/messages';
import { downloadSvg } from '../../util/svg';
import { getUserRoles, hasPermissions, PERMISSION_LOGGED_IN } from '../../../lib/auth';
import { cleanDateCounts } from '../../../lib/dateUtil';

const localMessages = {
  overallSeries: { id: 'explorer.attention.series.overall', defaultMessage: 'Whole Query' },
  bubbleChartTitle: { id: 'explorer.attention.bubbleChart.title', defaultMessage: 'Total Attention' },
  lineChartTitle: { id: 'explorer.attention.lineChart.title', defaultMessage: 'Attention Over Time' },
};

const SECS_PER_DAY = 1000 * 60 * 60 * 24;
const COLORS = d3.schemeCategory10;

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
      nextProps.urlQueryString.searchId !== urlQueryString.searchId) {
    // TODO also check for name and color changes
      fetchData(nextProps.urlQueryString.searchId);
    }
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
            name: query.q,
            data: data.values,
            pointStart: data.start,
            pointInterval: data.intervalMs,
            color: COLORS[idx + 1],
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
                <DownloadButton
                  tooltip={formatMessage(messages.download)}
                  onClick={() => downloadSvg()}
                />
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
  intl: React.PropTypes.object.isRequired,
  // from dispatch
  fetchData: React.PropTypes.func.isRequired,
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
  user: state.user,
  urlQueryString: ownProps.params,
  fetchStatus: state.explorer.sentenceCount.fetchStatus,
  results: state.explorer.sentenceCount.results,
});

const mapDispatchToProps = (dispatch, state) => ({
  fetchData: (query, idx) => {
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
      if (idx) { // specific change/update here
        dispatch(fetchQuerySentenceCounts(query, idx));
      } else { // get all results
        state.queries.map((q, index) => dispatch(fetchQuerySentenceCounts(q, index)));
      }
    } else if (state.params && state.params.searchId) { // else assume DEMO mode
      let runTheseQueries = state.sampleSearches[state.params.searchId].data;
      // merge sample search queries with custom

      // find queries on stack without id but with index and with q, and add?
      const newQueries = state.queries.filter(q => q.id === undefined && q.index);
      runTheseQueries = runTheseQueries.concat(newQueries);
      runTheseQueries.map((q, index) => {
        const demoInfo = {
          index, // should be same as q.index btw
          search_id: state.params.searchId, // may or may not have these
          query_id: q.id, // TODO if undefined, what to do?
          q: q.q, // only if no query id, means demo user added a keyword
        };
        return dispatch(fetchDemoQuerySentenceCounts(demoInfo)); // id
      });
    }
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData();
    },
  });
}

export default
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(
    asyncContainerize(
      injectIntl(
        AttentionComparisonContainer
      )
    )
  );
