import React from 'react';
import { connect } from 'react-redux';

import ErrorTryAgain from '../../util/ErrorTryAgain';
import LoadingSpinner from '../../util/LoadingSpinner';
import TimespanSelector from './TimespanSelector';
import { fetchTopicSnapshotTimeslicesList, filterByTimespan } from '../../../actions/topicActions';
import * as fetchConstants from '../../../lib/fetchConstants.js';

class TimespanSelectorContainer extends React.Component {
  componentDidMount() {
    const { fetchData, topicId, snapshotId } = this.props;
    if (snapshotId !== null) {
      fetchData(topicId, snapshotId);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.snapshotId !== this.props.snapshotId) {
      const { topicId, fetchData } = this.props;
      fetchData(topicId, nextProps.snapshotId);
    }
  }
  getStyles() {
    const styles = {
      root: {
      },
    };
    return styles;
  }
  render() {
    const { timespans, fetchStatus, fetchData, onTimespanSelected } = this.props;
    let content = fetchStatus;
    const styles = this.getStyles();
    switch (fetchStatus) {
      case fetchConstants.FETCH_SUCCEEDED:
        content = <TimespanSelector timespans={timespans} onTimespanSelected={onTimespanSelected} />;
        break;
      case fetchConstants.FETCH_FAILED:
        content = <ErrorTryAgain onTryAgain={fetchData} />;
        break;
      default:
        content = <LoadingSpinner />;
    }
    return (
      <div style={styles.root}>
        {content}
      </div>
    );
  }
}

TimespanSelectorContainer.propTypes = {
  fetchStatus: React.PropTypes.string.isRequired,
  timespans: React.PropTypes.array.isRequired,
  fetchData: React.PropTypes.func.isRequired,
  onTimespanSelected: React.PropTypes.func.isRequired,
  topicId: React.PropTypes.number.isRequired,
  snapshotId: React.PropTypes.number,
  timespanId: React.PropTypes.number,
};

const mapStateToProps = (state) => ({
  topicId: state.topics.selected.id,
  fetchStatus: state.topics.selected.timespans.fetchStatus,
  timespans: state.topics.selected.timespans.list,
  snapshotId: state.topics.selected.filters.snapshotId,
  timespanId: state.topics.selected.filters.timespanId,
});

const mapDispatchToProps = (dispatch) => ({
  fetchData: (topicId, snapshotId) => {
    dispatch(fetchTopicSnapshotTimeslicesList(topicId, snapshotId));
  },
  onTimespanSelected: (event) => {
    dispatch(filterByTimespan(event.target.value));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimespanSelectorContainer);
