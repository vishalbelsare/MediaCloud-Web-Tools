import React from 'react';
import * as d3 from 'd3';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib';
import { fetchTopicSentenceCounts, fetchTopicFocalSetSetenceCounts } from '../../../actions/topicActions';
import { asyncContainerize } from '../../common/AsyncContainer';
import DataCard from '../../common/DataCard';
import AttentionOverTimeChart from '../../vis/AttentionOverTimeChart';
import BubbleChart, { PLACEMENT_AUTO } from '../../vis/BubbleChart';
import { DownloadButton } from '../../common/IconButton';
import messages from '../../../resources/messages';
import { domElementToSvgString } from '../../util/svg';

const localMessages = {
  overallSeries: { id: 'topic.attention.series.overall', defaultMessage: 'Overall' },
  bubbleChartTitle: { id: 'topic.attention.bubbleChart.title', defaultMessage: 'Total Attention' },
  lineChartTitle: { id: 'topic.attention.lineChart.title', defaultMessage: 'Attention Over Time' },
};

const SECS_PER_DAY = 1000 * 60 * 60 * 24;
const COLORS = d3.schemeCategory10;
const BUBBLE_CHART_DOM_ID = 'total-attention-bubble-chart';

function dataAsSeries(data) {
  // clean up the data
  const dates = data.map(d => d.date);
  // turning variable time unit into days
  const intervalMs = (dates[1] - dates[0]);
  const intervalDays = intervalMs / SECS_PER_DAY;
  const values = data.map(d => Math.round(d.count / intervalDays));
  return { values, intervalMs, start: dates[0] };
}

class FociAttentionComparisonContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { selectedFocalSetId, filters, fetchData } = this.props;
    if ((nextProps.selectedFocalSetId !== selectedFocalSetId) || (nextProps.filters.timespanId !== filters.timespanId)) {
      fetchData(nextProps.topicId, nextProps.selectedFocalSetId, filters);
    }
  }
  render() {
    const { focalSet, overallTotal, overallCounts } = this.props;
    const { formatMessage } = this.props.intl;
    // stich together bubble chart data
    const bubbleData = [
      ...focalSet.foci.map((focus, idx) => ({
        label: focus.name, value: focus.total, color: COLORS[idx + 1],
      })),
      { label: formatMessage(localMessages.overallSeries), value: overallTotal, color: COLORS[0] },
    ];
    // stich together line chart data
    const overallData = dataAsSeries(overallCounts);      // now add a series for the whole thing
    const series = [
      ...focalSet.foci.map((focus, idx) => {    // add series for all the foci
        const data = dataAsSeries(focus.counts);
        return {
          id: idx,
          name: focus.name,
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
                  onClick={() => window.open(domElementToSvgString(BUBBLE_CHART_DOM_ID), '_new')}
                />
              </div>
              <h2><FormattedMessage {...localMessages.bubbleChartTitle} /></h2>
              <BubbleChart
                data={bubbleData}
                placement={PLACEMENT_AUTO}
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

FociAttentionComparisonContainer.propTypes = {
  // from parent
  filters: React.PropTypes.object.isRequired,
  selectedFocalSetId: React.PropTypes.string.isRequired,
  topicId: React.PropTypes.number.isRequired,
  // from composition
  intl: React.PropTypes.object.isRequired,
  // from dispatch
  fetchData: React.PropTypes.func.isRequired,
  // from mergeProps
  asyncFetch: React.PropTypes.func.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  focalSet: React.PropTypes.object.isRequired,
  overallTotal: React.PropTypes.number.isRequired,
  overallCounts: React.PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.attention.fetchStatus,
  focalSet: state.topics.selected.attention.focalSet,
  overallTotal: state.topics.selected.summary.sentenceCount.total,
  overallCounts: state.topics.selected.summary.sentenceCount.counts,
});

const mapDispatchToProps = dispatch => ({
  fetchData: (topicId, focalSetId, filters) => {
    if (topicId !== null) {
      if ((focalSetId !== null) && (focalSetId !== undefined)) {
        // fetch the total counts, then counts for each foci
        dispatch(fetchTopicSentenceCounts(topicId, filters))
          .then(() => dispatch(fetchTopicFocalSetSetenceCounts(topicId, focalSetId, filters)));
      }
    }
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(ownProps.topicId, ownProps.selectedFocalSetId, ownProps.filters);
    },
  });
}

export default
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(
    asyncContainerize(
      injectIntl(
        FociAttentionComparisonContainer
      )
    )
  );
