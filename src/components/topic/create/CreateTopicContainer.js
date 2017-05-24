import React from 'react';
import { injectIntl, FormattedHTMLMessage } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../common/AsyncContainer';
import { fetchUserQueuedAndRunningTopics } from '../../../actions/topicActions';
import { WarningNotice } from '../../common/Notice';
import TopicBuilderWizard from './TopicBuilderWizard';

const localMessages = {
  cannotCreateTopic: { id: 'topic.create.cannotCreateTopic', defaultMessage: 'You cannot create a new topic right now because you are currently running another topic: {name} #{id}' },
};

const CreateTopicContainer = (props) => {
  const { canCreateTopic, runningTopics } = props;

  if (!canCreateTopic) {
    return (
      <WarningNotice><FormattedHTMLMessage {...localMessages.cannotCreateTopic} values={{ name: runningTopics[0].name, id: runningTopics[0].topics_id }} /></WarningNotice>
    );
  }
  return (
    <TopicBuilderWizard
      startStep={0}
      location={location}
    />
  );
};

CreateTopicContainer.propTypes = {
  location: React.PropTypes.object.isRequired,
  intl: React.PropTypes.object.isRequired,
  canCreateTopic: React.PropTypes.bool,
  runningTopics: React.PropTypes.array,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.create.userRunningTopicStatus.fetchStatus,
  canCreateTopic: state.topics.create.userRunningTopicStatus.allowed,
  runningTopics: state.topics.create.userRunningTopicStatus.runningTopics,
});

const mapDispatchToProps = dispatch => ({
  asyncFetch: () => {
    dispatch(fetchUserQueuedAndRunningTopics());
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeAsyncContainer(
        CreateTopicContainer
      )
    )
  );
