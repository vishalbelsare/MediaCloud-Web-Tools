import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { schemeCategory20 } from 'd3';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { fetchTopicNytLabelCounts } from '../../../actions/topicActions';
import composeAsyncContainer from '../../common/AsyncContainer';
import BubbleChart, { PLACEMENT_HORIZONTAL, TEXT_PLACEMENT_CENTER } from '../../vis/BubbleChart';

const BUBBLE_CHART_DOM_ID = 'source-representation-bubble-chart';
const COLORS = schemeCategory20;
const PERCENTAGE_MIN_VALUE = 0.05; // anything lower than this goes into an "other" bubble

class NytLabelCountsContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { fetchData, filters } = this.props;
    if (nextProps.filters.timespanId !== filters.timespanId) {
      fetchData(nextProps);
    }
  }
  downloadCsv = () => {
    const { topicId, filters } = this.props;
    const url = `/api/topics/${topicId}/nyt-labels/counts.csv?snapshotId=${filters.snapshotId}&timespanId=${filters.timespanId}`;
    window.location = url;
  }
  render() {
    const { data } = this.props;
    const dataOverMinTheshold = data.filter(d => d.pct > PERCENTAGE_MIN_VALUE);
    const bubbleData = [
      ...dataOverMinTheshold.map((s, idx) => ({
        id: idx,
        label: s.tag,
        value: s.pct * 100,
        color: COLORS[idx + 1],
      })),
    ];
    return (
      <div className="nyt-label-count">
        <Grid>
          <Row>
            <Col lg={12}>
              <BubbleChart
                data={bubbleData}
                placement={PLACEMENT_HORIZONTAL}
                width={800}
                height={220}
                domId={BUBBLE_CHART_DOM_ID}
                textPlacement={TEXT_PLACEMENT_CENTER}
                maxBubbleRadius={80}
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

NytLabelCountsContainer.propTypes = {
  // from composition chain
  intl: React.PropTypes.object.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  filters: React.PropTypes.object.isRequired,
  topicId: React.PropTypes.number.isRequired,
  data: React.PropTypes.array,
  // from dispatch
  fetchData: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.nytlabels.fetchStatus,
  data: state.topics.selected.nytlabels.results,
  filters: state.topics.selected.filters,
  topicId: state.topics.selected.id,
});

const mapDispatchToProps = dispatch => ({
  fetchData: (props) => {
    dispatch(fetchTopicNytLabelCounts(props.topicId, props.filters));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(stateProps);
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      composeAsyncContainer(
        NytLabelCountsContainer
      )
    )
  );
