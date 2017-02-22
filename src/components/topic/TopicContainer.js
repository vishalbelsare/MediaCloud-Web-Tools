import React from 'react';
import Title from 'react-title-component';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../common/AsyncContainer';
import { selectTopic, filterBySnapshot, filterByTimespan, filterByFocus, fetchTopicSummary } from '../../actions/topicActions';
import { addNotice } from '../../actions/appActions';
import { TOPIC_SNAPSHOT_STATE_QUEUED, TOPIC_SNAPSHOT_STATE_RUNNING, TOPIC_SNAPSHOT_STATE_ERROR } from '../../reducers/topics/selected/info';
import { LEVEL_WARNING, LEVEL_ERROR } from '../common/Notice';

const localMessages = {
  needsSnapshotWarning: { id: 'needSnapshot.warning', defaultMessage: 'You\'ve made changes to your Topic that require a new snapshot to be generated!' },
  snapshotBuilderLink: { id: 'needSnapshot.snapshotBuilderLink', defaultMessage: 'Visit the Snapshot Builder for details.' },
  snapshotGeneratingWarning: { id: 'snapshotGenerating.warning', defaultMessage: 'We are creating a new snapshot right now. Please reload this page in a minute to automatically see the freshest data.' },
  snapshotFailed: { id: 'snapshotFailed.warning', defaultMessage: 'We tried to generate a new snapshot, but it failed.' },
};

class TopicContainer extends React.Component {
  componentWillMount() {
    const { topicInfo, needsNewSnapshot, addAppNotice } = this.props;
    const { formatMessage } = this.props.intl;
    // warn user if they made changes that require a new snapshot
    if (needsNewSnapshot) {
      addAppNotice({ level: LEVEL_WARNING, message: formatMessage(localMessages.needsSnapshotWarning) });
    }
    // warn user if snapshot is being generated
    if ((topicInfo.latestSnapshotState === TOPIC_SNAPSHOT_STATE_QUEUED) ||
        (topicInfo.latestSnapshotState === TOPIC_SNAPSHOT_STATE_RUNNING)) {
      addAppNotice({ level: LEVEL_WARNING, message: formatMessage(localMessages.snapshotGeneratingWarning) });
    }
    // error if snapshot failed
    if (TOPIC_SNAPSHOT_STATE_ERROR === topicInfo.latestSnapshotState) {
      addAppNotice({
        level: LEVEL_ERROR,
        message: formatMessage(localMessages.snapshotFailed),
        details: topicInfo.snapshot_status.job_states[0].message,
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    const { topicId, topicInfo, selectNewTopic, needsNewSnapshot, addAppNotice } = this.props;
    const { formatMessage } = this.props.intl;
    if ((nextProps.topicId !== topicId)) {
      selectNewTopic(topicId);
      // warn user if they made changes that require a new snapshot
      if (needsNewSnapshot) {
        addAppNotice({ level: LEVEL_WARNING, message: formatMessage(localMessages.needsSnapshotWarning) });
      }
      // warn user if snapshot is being generated
      if ((topicInfo.latestSnapshotState === TOPIC_SNAPSHOT_STATE_QUEUED) ||
          (topicInfo.latestSnapshotState === TOPIC_SNAPSHOT_STATE_RUNNING)) {
        addAppNotice({ level: LEVEL_WARNING, message: formatMessage(localMessages.snapshotGeneratingWarning) });
      }
      // error if snapshot failed
      if (TOPIC_SNAPSHOT_STATE_ERROR === topicInfo.latestSnapshotState) {
        addAppNotice({
          level: LEVEL_ERROR,
          message: formatMessage(localMessages.snapshotFailed),
          details: topicInfo.snapshot_status.job_states[0].message,
        });
      }
    }
  }
  filtersAreSet() {
    const { filters, topicId } = this.props;
    return ((topicId !== null) && (filters.snapshotId !== null) && (filters.timespanId !== null));
  }
  render() {
    const { children, topicInfo } = this.props;
    const titleHandler = parentTitle => `${topicInfo.name} | ${parentTitle}`;
    return (
      <div className="topic-container">
        <div>
          <Title render={titleHandler} />
          {children}
        </div>
      </div>
    );
  }
}

TopicContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  children: React.PropTypes.node,
  location: React.PropTypes.object.isRequired,
  topicId: React.PropTypes.number.isRequired,
  // from dispatch
  asyncFetch: React.PropTypes.func.isRequired,
  selectNewTopic: React.PropTypes.func.isRequired,
  addAppNotice: React.PropTypes.func.isRequired,
  // from state
  filters: React.PropTypes.object.isRequired,
  fetchStatus: React.PropTypes.string.isRequired,
  topicInfo: React.PropTypes.object,
  needsNewSnapshot: React.PropTypes.bool.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  filters: state.topics.selected.filters,
  fetchStatus: state.topics.selected.info.fetchStatus,
  topicInfo: state.topics.selected.info,
  topicId: parseInt(ownProps.params.topicId, 10),
  needsNewSnapshot: state.topics.selected.needsNewSnapshot,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  addAppNotice: (info) => {
    dispatch(addNotice(info));
  },
  selectNewTopic: (topicId) => {
    dispatch(selectTopic(topicId));
  },
  asyncFetch: () => {
    dispatch(selectTopic(ownProps.params.topicId));
    // select any filters that are there
    const query = ownProps.location.query;
    if (ownProps.location.query.snapshotId) {
      dispatch(filterBySnapshot(query.snapshotId));
    }
    if (ownProps.location.query.focusId) {
      dispatch(filterByFocus(query.focusId));
    }
    if (ownProps.location.query.timespanId) {
      dispatch(filterByTimespan(query.timespanId));
    }
    dispatch(fetchTopicSummary(ownProps.params.topicId));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
        composeAsyncContainer(
          TopicContainer
        )
      )
  );
