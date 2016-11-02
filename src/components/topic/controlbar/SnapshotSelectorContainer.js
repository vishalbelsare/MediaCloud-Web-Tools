import React from 'react';
import { push, replace } from 'react-router-redux';
import { connect } from 'react-redux';
import SnapshotSelector from './SnapshotSelector';
import { fetchTopicSnapshotsList, filterBySnapshot } from '../../../actions/topicActions';
import { NO_SPINNER, asyncContainerize } from '../../common/AsyncContainer';
import { filteredLocation } from '../../util/location';

class SnapshotSelectorContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.topicId !== this.props.topicId) {
      const { fetchData } = this.props;
      fetchData(nextProps.topicId, nextProps.snapshotId);
    }
  }
  render() {
    const { snapshots, handleSnapshotSelected, snapshotId } = this.props;
    return (
      <SnapshotSelector
        selectedId={snapshotId}
        snapshots={snapshots}
        onSnapshotSelected={handleSnapshotSelected}
      />
    );
  }
}

SnapshotSelectorContainer.propTypes = {
  // from parent
  topicId: React.PropTypes.number.isRequired,
  location: React.PropTypes.object.isRequired,
  // from dispatch
  fetchData: React.PropTypes.func.isRequired,
  handleSnapshotSelected: React.PropTypes.func.isRequired,
  // from mergeProps
  asyncFetch: React.PropTypes.func.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  snapshots: React.PropTypes.array.isRequired,
  snapshotId: React.PropTypes.number,
};

const mapStateToProps = state => ({
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
            // default to first snapshot (ie. latest) if none is specified
            const firstReadySnapshot = response.list.find(s => s.state === 'completed');
            const newSnapshotId = firstReadySnapshot.snapshots_id;
            const newLocation = filteredLocation(ownProps.location, {
              snapshotId: newSnapshotId,
              timespanId: null,
              focusId: null,
            });
            dispatch(replace(newLocation)); // do a replace, not a push here so the non-snapshot url isn't in the history
            dispatch(filterBySnapshot(newSnapshotId));
          }
        });
    }
  },
  handleSnapshotSelected: (snapshotId) => {
    const newLocation = filteredLocation(ownProps.location, {
      snapshotId,
      timespanId: null,
      focusId: null,
    });
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
    asyncContainerize(
      SnapshotSelectorContainer, NO_SPINNER
    )
  );
