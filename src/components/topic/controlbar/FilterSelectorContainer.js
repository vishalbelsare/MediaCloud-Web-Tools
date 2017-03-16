import React from 'react';
import { injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { push, replace } from 'react-router-redux';
import { connect } from 'react-redux';
import { fetchTopicSnapshotsList, filterBySnapshot } from '../../../actions/topicActions';
import FocusSelectorContainer from './FocusSelectorContainer';
import { addNotice } from '../../../actions/appActions';
import { NO_SPINNER, asyncContainerize } from '../../common/AsyncContainer';
import { filteredLocation } from '../../util/location';
import { snapshotIsUsable, TOPIC_SNAPSHOT_STATE_COMPLETED, TOPIC_SNAPSHOT_STATE_QUEUED, TOPIC_SNAPSHOT_STATE_RUNNING, TOPIC_SNAPSHOT_STATE_ERROR } from '../../../reducers/topics/selected/snapshots';
import SnapshotSelector from './SnapshotSelector';
import { LEVEL_WARNING, LEVEL_ERROR } from '../../common/Notice';

const localMessages = {
  snapshotQueued: { id: 'snapshotGenerating.warning.queued', defaultMessage: 'We will start creating the new snapshot soon. Please reload this page in a minute to automatically see the freshest data.' },
  snapshotRunning: { id: 'snapshotGenerating.warning.running', defaultMessage: 'We are creating a new snapshot right now. Please reload this page in a minute to automatically see the freshest data.' },
  snapshotImporting: { id: 'snapshotGenerating.warning.importing', defaultMessage: 'We are importing the new snapshot now. Please reload this page in a minute to automatically see the freshest data.' },
  snapshotFailed: { id: 'snapshotFailed.warning', defaultMessage: 'We tried to generate a new snapshot, but it failed.' },
};

/**
 * As the parent of other filters, it is useful for this one to own the snapshot selection process,
 * mostly so that heppens first before other things render.
 */
const FilterSelectorContainer = (props) => {
  const { filters, topicId, filtersVisible, snapshotId, snapshots, location, handleSnapshotSelected, onFocusSelected } = props;
  let content = null;
  let focusSelectorContent = null;
  if (snapshotId) {
    focusSelectorContent = (
      <FocusSelectorContainer
        topicId={topicId}
        location={location}
        snapshotId={filters.snapshotId}
        onFocusSelected={onFocusSelected}
      />
    );
  }
  if (filtersVisible) {
    content = (
      <div className="filter-selector">
        <Grid>
          <Row>
            <Col lg={4}>
              {focusSelectorContent}
            </Col>
            <Col lg={4}>
              <SnapshotSelector
                selectedId={snapshotId}
                snapshots={snapshots}
                onSnapshotSelected={handleSnapshotSelected}
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
  return content;
};

FilterSelectorContainer.propTypes = {
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
  location: React.PropTypes.object.isRequired,
  // from parent
  onFocusSelected: React.PropTypes.func.isRequired,
  // from dispatch
  handleSnapshotSelected: React.PropTypes.func.isRequired,
  // from state
  filters: React.PropTypes.object.isRequired,
  topicId: React.PropTypes.number.isRequired,
  fetchStatus: React.PropTypes.string.isRequired,
  snapshots: React.PropTypes.array.isRequired,
  snapshotId: React.PropTypes.number,
  filtersVisible: React.PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  filters: state.topics.selected.filters,
  filtersVisible: state.topics.selected.filtersVisible,
  topicId: state.topics.selected.id,
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
          if (response.jobStatus) {
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
          }
        });
    }
  },
  handleSnapshotSelected: (snapshot) => {
    const newLocation = filteredLocation(ownProps.location, {
      snapshots_id: snapshot.snapshots_id,
      timespanId: null,
      focusId: null,
    });
    dispatch(filterBySnapshot(snapshot.snapshots_id));
    dispatch(push(newLocation));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(stateProps.topicId, stateProps.snapshotId);
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      asyncContainerize(
        FilterSelectorContainer, NO_SPINNER
      )
    )
  );
