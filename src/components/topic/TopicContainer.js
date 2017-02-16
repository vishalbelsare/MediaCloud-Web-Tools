import React from 'react';
import Title from 'react-title-component';
import { FormattedMessage, injectIntl } from 'react-intl';
import Link from 'react-router/lib/Link';
import { connect } from 'react-redux';
import composeAsyncContainer from '../common/AsyncContainer';
import { selectTopic, filterBySnapshot, filterByTimespan, filterByFocus, fetchTopicSummary } from '../../actions/topicActions';
import TopicWarning from './TopicWarning';
import { TOPIC_SNAPSHOT_STATE_QUEUED, TOPIC_SNAPSHOT_STATE_RUNNING, TOPIC_SNAPSHOT_STATE_ERROR } from '../../reducers/topics/selected/info';

const localMessages = {
  needsSnapshotWarning: { id: 'needSnapshot.warning', defaultMessage: 'You\'ve made changes to your Topic that require a new snapshot to be generated!' },
  snapshotBuilderLink: { id: 'needSnapshot.snapshotBuilderLink', defaultMessage: 'Visit the Snapshot Builder for details.' },
  snapshotGeneratingWarning: { id: 'snapshotGenerating.warning', defaultMessage: 'We are creating a new snapshot right now. Please reload this page in a minute to automatically see the freshest data.' },
  snapshotFailed: { id: 'snapshotFailed.warning', defaultMessage: 'We tried to generate a new snapshot, but it failed.  The error is: ' },
};

class TopicContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { topicId, selectNewTopic } = this.props;
    if ((nextProps.topicId !== topicId)) {
      // console.log('componentWillReceiveProps');
      selectNewTopic(topicId);
    }
  }
/*
  shouldComponentUpdate(nextProps) {
    const { topicId } = this.props;
    return nextProps.topicId !== topicId;
  }
*/
  filtersAreSet() {
    const { filters, topicId } = this.props;
    return ((topicId !== null) && (filters.snapshotId !== null) && (filters.timespanId !== null));
  }
  render() {
    const { children, topicInfo, topicId, needsNewSnapshot } = this.props;
    const titleHandler = parentTitle => `${topicInfo.name} | ${parentTitle}`;
    let warning = null;
    // warn user if they made changes that require a new snapshot
    if (needsNewSnapshot) {
      warning = (
        <TopicWarning>
          <FormattedMessage {...localMessages.warning} />
          &nbsp;
          <Link to={`/topics/${topicId}/snapshot`}>
            <FormattedMessage {...localMessages.snapshotBuilderLink} />
          </Link>
        </TopicWarning>
      );
    }
    // warn user if snapshot is being generated
    if ([TOPIC_SNAPSHOT_STATE_QUEUED, TOPIC_SNAPSHOT_STATE_RUNNING].contains(topicInfo.latestSnapshotState)) {
      warning = (
        <TopicWarning>
          <FormattedMessage {...localMessages.snapshotGeneratingWarning} />
        </TopicWarning>
      );
    }
    // error if snapshot failed
    if (TOPIC_SNAPSHOT_STATE_ERROR === topicInfo.latestSnapshotState) {
      warning = (
        <TopicWarning>
          <FormattedMessage {...localMessages.snapshotFailed} />
          {topicInfo.snapshot_status.job_states[0].message}
        </TopicWarning>
      );
    }
    return (
      <div className="topic-container">
        <div>
          <Title render={titleHandler} />
          {warning}
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
