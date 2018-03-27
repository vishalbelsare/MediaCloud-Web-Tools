import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedHTMLMessage } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../common/AsyncContainer';
import { fetchUserQueuedAndRunningTopics } from '../../../actions/topicActions';
import { WarningNotice } from '../../common/Notice';
import TopicBuilderWizard from './TopicBuilderWizard';
import { getUserRoles, hasPermissions, PERMISSION_TOPIC_ADMIN } from '../../../lib/auth';

const localMessages = {
  cannotCreateTopic: { id: 'topic.create.cannotCreateTopic', defaultMessage: 'You cannot create a new topic right now because you are currently running another topic: {name} #{id}' },
  edit: { id: 'topic.edit.title', defaultMessage: 'Edit Topic' },
};

const EditUpdateTopicContainer = (props) => {
  const { canUpdateTopic, topicInfo, runningTopics, user } = props; // initial values in the case of an editUpdate (after a reset)
  const { formatMessage } = props.intl;
  let initialValues = {};
  if (topicInfo) {
      // load sources and collections in a backwards compatible way
    const sources = topicInfo.media ? topicInfo.media.map(t => ({ ...t })) : [];
    const collections = topicInfo.media_tags ? topicInfo.media_tags.map(t => ({ ...t, name: t.label })) : [];
    const sourcesAndCollections = sources.concat(collections);
    initialValues = {
      ...topicInfo,
      sourcesAndCollections,
      title: formatMessage(localMessages.edit),
    };
  }
  if (!hasPermissions(getUserRoles(user), PERMISSION_TOPIC_ADMIN) && !canUpdateTopic) {
    return (
      <WarningNotice><FormattedHTMLMessage {...localMessages.cannotCreateTopic} values={{ name: runningTopics[0].name, id: runningTopics[0].topics_id }} /></WarningNotice>
    );
  }
  return (
    <TopicBuilderWizard
      startStep={0}
      location={location}
      initialValues={initialValues}
    />
  );
};

EditUpdateTopicContainer.propTypes = {
  location: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
  canUpdateTopic: PropTypes.bool,
  runningTopics: PropTypes.array,
  user: PropTypes.object,
  initialValues: PropTypes.object,
  topicInfo: PropTypes.object,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.create.userRunningTopicStatus.fetchStatus,
  canUpdateTopic: state.topics.create.userRunningTopicStatus.allowed,
  runningTopics: state.topics.create.userRunningTopicStatus.runningTopics,
  user: state.user,
  topicInfo: state.topics.selected.info,
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
        EditUpdateTopicContainer
      )
    )
  );
