import React from 'react';
import Title from 'react-title-component';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../common/AsyncContainer';
import { selectTopic, filterBySnapshot, filterByTimespan, filterByFocus, fetchTopicSummary, filterByQuery } from '../../actions/topicActions';
import { addNotice, setSubHeaderVisible } from '../../actions/appActions';
import { LEVEL_WARNING, LEVEL_ERROR, ErrorNotice } from '../common/Notice';
import TopicUnderConstruction from './TopicUnderConstruction';

const localMessages = {
  needsSnapshotWarning: { id: 'needSnapshot.warning', defaultMessage: 'You\'ve made changes to your Topic that require a new snapshot to be generated!' },
  snapshotBuilderLink: { id: 'needSnapshot.snapshotBuilderLink', defaultMessage: 'Visit the Snapshot Builder for details.' },
  hasAnError: { id: 'topic.hasError', defaultMessage: 'Sorry, this topic has an error!  See the notes at the top if this page for more technical details.' },
};

class TopicContainer extends React.Component {
  componentWillMount() {
    const { needsNewSnapshot, addAppNotice, topicInfo } = this.props;
    const { formatMessage } = this.props.intl;
    // warn user if they made changes that require a new snapshot
    if (needsNewSnapshot) {
      addAppNotice({ level: LEVEL_WARNING, message: formatMessage(localMessages.needsSnapshotWarning) });
    }
    if (topicInfo.state === 'error') {
      addAppNotice({ level: LEVEL_ERROR, message: topicInfo.message });
    }
  }
  componentWillReceiveProps(nextProps) {
    const { topicId, topicInfo, selectNewTopic, needsNewSnapshot, addAppNotice } = this.props;
    const { formatMessage } = this.props.intl;
    // if they edited the topic, or the topic changed then reload
    if ((nextProps.topicInfo !== topicInfo) || (nextProps.topicId !== topicId)) {
      selectNewTopic(topicId);
      // warn user if they made changes that require a new snapshot
      if (needsNewSnapshot) {
        addAppNotice({ level: LEVEL_WARNING, message: formatMessage(localMessages.needsSnapshotWarning) });
      }
      if (topicInfo.state === 'error') {
        addAppNotice({ level: LEVEL_ERROR, message: topicInfo.message });
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
    // show a big error if there is one to show
    let notice = null;
    let contentToShow = children;
    switch (topicInfo.state) {
      case 'running':
        contentToShow = (<TopicUnderConstruction />);
        break;
      case 'error':
        notice = (
          <ErrorNotice>
            <FormattedMessage {...localMessages.hasAnError} />
          </ErrorNotice>
        );
        break;
      default:
        notice = null;
        break;
    }
    return (
      <div className="topic-container">
        <div>
          <Title render={titleHandler} />
          {notice}
          {contentToShow}
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
    if (topicId === null) {
      dispatch(setSubHeaderVisible(false));
    }
  },
  asyncFetch: () => {
    dispatch(selectTopic(ownProps.params.topicId));
    // select any filters that are serialized on the url
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
    if (ownProps.location.query.q) {
      dispatch(filterByQuery(query.q));
    }
    dispatch(fetchTopicSummary(ownProps.params.topicId))
      .then(() => dispatch(setSubHeaderVisible(true)));
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
