import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { fetchTopicFocalSetSetenceCounts } from '../../../actions/topicActions';
import { asyncContainerize } from '../../common/AsyncContainer';
import AttentionOverTimeChart from '../../vis/AttentionOverTimeChart';

const SECS_PER_DAY = 1000 * 60 * 60 * 24;

class FociAttentionComparisonContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { selectedFocalSetId, filters, fetchData } = this.props;
    if ((nextProps.selectedFocalSetId !== selectedFocalSetId) || (nextProps.filters.timespanId !== filters.timespanId)) {
      fetchData(nextProps.topicId, nextProps.selectedFocalSetId, filters);
    }
  }
  render() {
    const { focalSet } = this.props;
    const series = focalSet.foci.map((focus, idx) => {
      // clean up the data
      const dates = focus.counts.map(d => d.date);
      // turning variable time unit into days
      const intervalMs = (dates[1] - dates[0]);
      const intervalDays = intervalMs / SECS_PER_DAY;
      const values = focus.counts.map(d => Math.round(d.count / intervalDays));
      return {
        id: idx,
        name: focus.name,
        data: values,
        pointStart: dates[0],
        pointInterval: intervalMs,
        cursor: 'pointer',
      };
    });
    return (
      <AttentionOverTimeChart
        series={series}
        height={300}
      />
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
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.attention.fetchStatus,
  focalSet: state.topics.selected.attention.focalSet,
});

const mapDispatchToProps = dispatch => ({
  fetchData: (topicId, focalSetId, filters) => {
    if (topicId !== null) {
      if ((focalSetId !== null) && (focalSetId !== undefined)) {
        dispatch(fetchTopicFocalSetSetenceCounts(topicId, focalSetId, filters));
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
