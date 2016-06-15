import React from 'react';
import { connect } from 'react-redux';

import ErrorTryAgain from '../../util/ErrorTryAgain';
import LoadingSpinner from '../../util/LoadingSpinner';
import SnapshotSelector from './SnapshotSelector';
import { fetchTopicSnapshotsList, filterBySnapshot } from '../../../actions/topicActions';
import * as fetchConstants from '../../../lib/fetchConstants.js';

class SnapshotSelectorContainer extends React.Component {
  componentDidMount() {
    this.refetchData();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.topicId !== this.props.topicId) {
      const { fetchData } = this.props;
      fetchData(nextProps.topicId, nextProps.snapshotId);
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
    const { fetchData, snapshotId, topicId } = this.props;
    fetchData(topicId, snapshotId);
  }
  render() {
    const { snapshots, fetchStatus, onSnapshotSelected, snapshotId } = this.props;
    let content = fetchStatus;
    const styles = this.getStyles();
    switch (fetchStatus) {
      case fetchConstants.FETCH_SUCCEEDED:
        content = <SnapshotSelector selectedId={snapshotId} snapshots={snapshots} onSnapshotSelected={onSnapshotSelected} />;
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

SnapshotSelectorContainer.propTypes = {
  fetchStatus: React.PropTypes.string.isRequired,
  snapshots: React.PropTypes.array.isRequired,
  fetchData: React.PropTypes.func.isRequired,
  onSnapshotSelected: React.PropTypes.func.isRequired,
  topicId: React.PropTypes.number,
  snapshotId: React.PropTypes.number,
};

const mapStateToProps = (state) => ({
  topicId: state.topics.selected.id,
  fetchStatus: state.topics.selected.snapshots.fetchStatus,
  snapshots: state.topics.selected.snapshots.list,
  snapshotId: state.topics.selected.filters.snapshotId,
});

const mapDispatchToProps = (dispatch) => ({
  fetchData: (topicId, snapshotId) => {
    if (topicId !== null) {
      dispatch(fetchTopicSnapshotsList(topicId))
        .then((response) => {
          if (snapshotId === null) {
            dispatch(filterBySnapshot(response.list[0].controversy_dumps_id));
          }
        });
    }
  },
  onSnapshotSelected: (snapshotId) => {
    dispatch(filterBySnapshot(snapshotId));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SnapshotSelectorContainer);
