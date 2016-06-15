import React from 'react';
import { connect } from 'react-redux';

import ErrorTryAgain from '../../util/ErrorTryAgain';
import LoadingSpinner from '../../util/LoadingSpinner';
import TimespanSelector from './TimespanSelector';
import { fetchTopicSnapshotTimespansList, filterByTimespan } from '../../../actions/topicActions';
import * as fetchConstants from '../../../lib/fetchConstants.js';

class TimespanSelectorContainer extends React.Component {
  componentDidMount() {
    const { topicId, snapshotId } = this.props;
    if ((topicId !== null) && (snapshotId !== null)) {
      this.refetchData();
    }
  }
  componentWillReceiveProps(nextProps) {
    if (((nextProps.topicId !== this.props.topicId) ||
        (nextProps.snapshotId !== this.props.snapshotId)) &&
        (nextProps.topicId !== null) && (nextProps.snapshotId !== null)) {
      const { fetchData } = this.props;
      fetchData(nextProps.topicId, nextProps.snapshotId, nextProps.timespanId);
    }
  }
  getStyles() {
    const styles = {
      root: {
      },
    };
    return styles;
  }
  refetchData = () => {
    const { topicId, snapshotId, fetchData } = this.props;
    fetchData(topicId, snapshotId);
  }
  render() {
    const { timespans, fetchStatus, onTimespanSelected } = this.props;
    let content = fetchStatus;
    const styles = this.getStyles();
    switch (fetchStatus) {
      case fetchConstants.FETCH_SUCCEEDED:
        content = <TimespanSelector timespans={timespans} onTimespanSelected={onTimespanSelected} />;
        break;
      case fetchConstants.FETCH_FAILED:
        content = <ErrorTryAgain onTryAgain={this.refetchData} />;
        break;
      default:
        content = <LoadingSpinner padding={0} size={10} />;
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
  topicId: React.PropTypes.number,
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
  fetchData: (topicId, snapshotId, timespanId) => {
    dispatch(fetchTopicSnapshotTimespansList(topicId, snapshotId))
      .then((response) => {
        if (timespanId === null) {
          dispatch(filterByTimespan(response.list[0].controversy_dump_time_slices_id));
        }
      });
  },
  onTimespanSelected: (event) => {
    dispatch(filterByTimespan(event.target.value));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimespanSelectorContainer);
