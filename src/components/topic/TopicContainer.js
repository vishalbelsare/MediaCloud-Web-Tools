import React from 'react';
import Title from 'react-title-component';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../common/AsyncContainer';
import { selectTopic, fetchTopicSummary, generateSnapshot } from '../../actions/topicActions';
import { updateFeedback } from '../../actions/appActions';
import messages from '../../resources/messages';
import NeedsNewSnapshotWarning from './NeedsNewSnapshotWarning';

class TopicContainer extends React.Component {
  filtersAreSet() {
    const { filters, topicId } = this.props;
    return ((topicId !== null) && (filters.snapshotId !== null) && (filters.timespanId !== null));
  }
  render() {
    const { children, topicInfo, needsNewSnapshot, handleGenerateSnapshotRequest } = this.props;
    const titleHandler = parentTitle => `${topicInfo.name} | ${parentTitle}`;
    return (
      <div className="topic-container">
        <div>
          <Title render={titleHandler} />
          <NeedsNewSnapshotWarning
            needsNewSnapshot={needsNewSnapshot}
            onGenerateSnapshotRequest={handleGenerateSnapshotRequest}
          />
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
  handleGenerateSnapshotRequest: React.PropTypes.func.isRequired,
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
  asyncFetch: () => {
    dispatch(selectTopic(ownProps.params.topicId));
    dispatch(fetchTopicSummary(ownProps.params.topicId));
  },
  handleGenerateSnapshotRequest: () => {
    dispatch(generateSnapshot(ownProps.params.topicId))
      .then((results) => {
        if (results.success === 1) {
          dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(messages.snapshotGenerating) }));
        } else {
          // TODO: error message!
        }
      });
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
