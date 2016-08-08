import React from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import SnapshotSelector from './SnapshotSelector';
import { fetchTopicSnapshotsList, filterBySnapshot } from '../../../actions/topicActions';
import composeAsyncContainer from '../../common/AsyncContainer';
import { filteredLocation } from '../../util/paging';

class SnapshotSelectorContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.topicId !== this.props.topicId) {
      const { fetchData } = this.props;
      fetchData(nextProps.topicId, nextProps.snapshotId);
    }
  }
  getStyles() {
    const styles = {
      root: {
        backgroundColor: '#303030',
        color: '#ffffff',
      },
      right: {
        float: 'right',
      },
    };
    return styles;
  }
  render() {
    const { snapshots, onSnapshotSelected, snapshotId } = this.props;
    const styles = this.getStyles();
    return (
      <div style={styles.root}>
        <div style={styles.right}>
          <SnapshotSelector selectedId={snapshotId}
            snapshots={snapshots} onSnapshotSelected={onSnapshotSelected}
          />
        </div>
      </div>
    );
  }
}

SnapshotSelectorContainer.propTypes = {
  // from parent
  topicId: React.PropTypes.number.isRequired,
  location: React.PropTypes.object.isRequired,
  // from dispatch
  fetchData: React.PropTypes.func.isRequired,
  onSnapshotSelected: React.PropTypes.func.isRequired,
  // from mergeProps
  asyncFetch: React.PropTypes.func.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  snapshots: React.PropTypes.array.isRequired,
  snapshotId: React.PropTypes.number,
};

const mapStateToProps = (state) => ({
  fetchStatus: state.topics.selected.snapshots.fetchStatus,
  snapshots: state.topics.selected.snapshots.list,
  snapshotId: state.topics.selected.filters.snapshotId,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (topicId, snapshotId) => {
    if (topicId !== null) {
      dispatch(fetchTopicSnapshotsList(topicId))
        .then((response) => {
          if (snapshotId === null) {
            const newSnapshotId = response.list[0].snapshots_id;
            const newLocation = filteredLocation(ownProps.location, newSnapshotId, null);
            dispatch(push(newLocation));
            dispatch(filterBySnapshot(newSnapshotId));
          }
        });
    }
  },
  onSnapshotSelected: (snapshotId) => {
    const newLocation = filteredLocation(ownProps.location, snapshotId, null);
    dispatch(push(newLocation));
    dispatch(filterBySnapshot(snapshotId));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(ownProps.topicId, stateProps.snapshotId);
    },
  });
}

export default
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(
    composeAsyncContainer(
      SnapshotSelectorContainer
    )
  );
