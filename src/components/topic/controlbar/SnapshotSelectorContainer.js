import React from 'react';
import { injectIntl } from 'react-intl';
import { push, replace } from 'react-router-redux';
import { connect } from 'react-redux';
import SnapshotSelector from './SnapshotSelector';
import { fetchTopicSnapshotsList, filterBySnapshot } from '../../../actions/topicActions';
import { NO_SPINNER, asyncContainerize } from '../../common/AsyncContainer';
import { addNotice } from '../../../actions/appActions';
import { filteredLocation } from '../../util/location';
import { snapshotIsUsable, TOPIC_SNAPSHOT_STATE_COMPLETED, TOPIC_SNAPSHOT_STATE_QUEUED, TOPIC_SNAPSHOT_STATE_RUNNING, TOPIC_SNAPSHOT_STATE_ERROR } from '../../../reducers/topics/selected/snapshots';
import { LEVEL_WARNING, LEVEL_ERROR } from '../../common/Notice';

const localMessages = {
  snapshotQueued: { id: 'snapshotGenerating.warning.queued', defaultMessage: 'We will start creating the new snapshot soon. Please reload this page in a minute to automatically see the freshest data.' },
  snapshotRunning: { id: 'snapshotGenerating.warning.running', defaultMessage: 'We are creating a new snapshot right now. Please reload this page in a minute to automatically see the freshest data.' },
  snapshotImporting: { id: 'snapshotGenerating.warning.importing', defaultMessage: 'We are importing the new snapshot now. Please reload this page in a minute to automatically see the freshest data.' },
  snapshotFailed: { id: 'snapshotFailed.warning', defaultMessage: 'We tried to generate a new snapshot, but it failed.' },
};

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
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
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
          // pick the first usable snapshot if one is not specified
          if (snapshotId === null) {
            // default to first snapshot (ie. latest) if none is specified
            const firstReadySnapshot = response.list.find(s => snapshotIsUsable(s));
            const newSnapshotId = firstReadySnapshot.snapshots_id;
            const newLocation = filteredLocation(ownProps.location, {
              snapshotId: newSnapshotId,
              timespanId: null,
              focusId: null,
            });
            dispatch(replace(newLocation)); // do a replace, not a push here so the non-snapshot url isn't in the history
            dispatch(filterBySnapshot(newSnapshotId));
          }
          // warn user if snapshot is being pending
          const latestSnapshotJobStatus = response.jobStatus[0];
          switch (latestSnapshotJobStatus.state) {
            case TOPIC_SNAPSHOT_STATE_QUEUED:
              dispatch(addNotice({ level: LEVEL_WARNING, message: ownProps.intl.formatMessage(localMessages.snapshotQueued) }));
              break;
            case TOPIC_SNAPSHOT_STATE_RUNNING:
              dispatch(addNotice({ level: LEVEL_WARNING, message: ownProps.intl.formatMessage(localMessages.snapshotRunning) }));
              break;
            case TOPIC_SNAPSHOT_STATE_ERROR:
              dispatch(addNotice({
                level: LEVEL_ERROR,
                message: ownProps.intl.formatMessage(localMessages.snapshotFailed),
                details: latestSnapshotJobStatus.message,
              }));
              break;
            case TOPIC_SNAPSHOT_STATE_COMPLETED:
              const latestSnapshot = response.list[0];
              if (!snapshotIsUsable(latestSnapshot)) {
                dispatch(addNotice({ level: LEVEL_WARNING, message: ownProps.intl.formatMessage(localMessages.snapshotImporting) }));
              }
              break;
            default:
              // don't alert user about anything
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
    dispatch(filterBySnapshot(snapshotId));
    dispatch(push(newLocation));
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
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      asyncContainerize(
        SnapshotSelectorContainer, NO_SPINNER
      )
    )
  );
