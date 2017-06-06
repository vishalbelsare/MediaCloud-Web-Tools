import React from 'react';
import * as d3 from 'd3';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib';
import { fetchSentenceCounts } from '../../../actions/explorerActions';
import { asyncContainerize } from '../../common/AsyncContainer';
import DataCard from '../../common/DataCard';
import AttentionOverTimeChart from '../../vis/AttentionOverTimeChart';
import PackedBubbleChart from '../../vis/PackedBubbleChart';
import { DownloadButton } from '../../common/IconButton';
import messages from '../../../resources/messages';
import { downloadSvg } from '../../util/svg';

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
    const { selected, fetchData } = this.props;
    if (nextProps.selected !== selected) {
      fetchData(nextProps.selected);
    }
  }
  render() {
    const { results, overallTotal, overallCounts } = this.props;
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
        {
          value: overallTotal,
          centerText: formatMessage(localMessages.overallSeries),
          rolloverText: `${formatMessage(localMessages.overallSeries)}: ${formatNumber(overallTotal)}`,
          fill: COLORS[0],
        },
      ];
    }
    // stich together line chart data
    const overallData = dataAsSeries(overallCounts);      // now add a series for the whole thing
    let series = [];
    if (results !== undefined) {
      series = [
        ...results.map((query, idx) => {    // add series for all the results
          const data = dataAsSeries(results.counts);
          return {
            id: idx,
            name: query.name,
            data: data.values,
            pointStart: data.start,
            pointInterval: data.intervalMs,
            color: COLORS[idx + 1],
          };
        }),
        {
          id: 9999,
          name: formatMessage(localMessages.overallSeries),
          data: overallData.values,
          pointStart: overallData.start,
          pointInterval: overallData.intervalMs,
          color: COLORS[0],
        },
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
  selected: React.PropTypes.object.isRequired,
  queries: React.PropTypes.array.isRequired,
  // from composition
  intl: React.PropTypes.object.isRequired,
  // from dispatch
  fetchData: React.PropTypes.func.isRequired,
  results: React.PropTypes.array.isRequired,
  // from mergeProps
  asyncFetch: React.PropTypes.func.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  overallTotal: React.PropTypes.number.isRequired,
  overallCounts: React.PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.explorer.selected.attention.fetchStatus,
  overallTotal: state.explorer.selected.sentenceCount.total,
  overallCounts: state.explorer.selected.sentenceCount.counts,
});

const mapDispatchToProps = dispatch => ({
  fetchData: (query) => {
    // for n queries, run the dispatch
        dispatch(fetchExplorerSentenceCounts(query))
      }
    }
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    // for n queries, run the dispatch
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
