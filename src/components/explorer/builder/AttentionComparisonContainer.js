import React from 'react';
import * as d3 from 'd3';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib';
import { fetchQuerySentenceCounts, fetchDemoQuerySentenceCounts } from '../../../actions/explorerActions';
import { asyncContainerize } from '../../common/AsyncContainer';
import DataCard from '../../common/DataCard';
import AttentionOverTimeChart from '../../vis/AttentionOverTimeChart';
import PackedBubbleChart from '../../vis/PackedBubbleChart';
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
const BUBBLE_CHART_DOM_ID = 'total-attention-bubble-chart';
const TOP_N_LABELS_TO_SHOW = 3; // only the top N bubbles will get a label visible on them (so the text is readable)

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
    const { results } = this.props;
    const { formatMessage, formatNumber } = this.props.intl;
    // stich together bubble chart data

    let bubbleData = [];
    if (results !== undefined && results.length > 0) {
      bubbleData = [
        ...results.sort((a, b) => b.total - a.total).map((focus, idx) => ({
          value: focus.total,
          centerText: (idx < TOP_N_LABELS_TO_SHOW) ? focus.name : null,
          rolloverText: `${focus.name}: ${formatNumber(focus.total)}`,
          fill: COLORS[idx + 1],
        })),
      ];
    }
    // stich together line chart data
    let series = [];
    if (results !== undefined) {
      series = [
        ...results.map((query, idx) => {    // add series for all the results
          const data = dataAsSeries(cleanDateCounts(query.split));
          return {
            id: idx,
            name: query.name,
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
              <h2><FormattedMessage {...localMessages.lineChartTitle} /></h2>
              <AttentionOverTimeChart series={series} height={300} />
            </DataCard>
          </Col>
        </Row>
        <Row>
          <Col lg={6} xs={12}>
            <DataCard>
              <div className="actions">
                <DownloadButton
                  tooltip={formatMessage(messages.download)}
                  onClick={() => downloadSvg(BUBBLE_CHART_DOM_ID)}
                />
              </div>
              <h2><FormattedMessage {...localMessages.bubbleChartTitle} /></h2>
              <PackedBubbleChart
                data={bubbleData}
                height={400}
                domId={BUBBLE_CHART_DOM_ID}
              />
            </DataCard>
          </Col>
        </Row>
      </div>
    );
  }
}

AttentionComparisonContainer.propTypes = {
  // from parent
  lastSearchTime: React.PropTypes.object.isRequired,
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
  overallTotal: React.PropTypes.array.isRequired,
  overallCounts: React.PropTypes.array.isRequired,
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
      const runTheseQueries = state.sampleSearches[state.params.searchId].data;
      runTheseQueries.map((q, index) => {
        const demoInfo = {
          index,
          search_id: state.params.searchId, // may or may not have these
          query_id: q.id,
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
