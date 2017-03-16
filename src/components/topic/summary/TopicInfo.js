import React from 'react';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';
import DataCard from '../../common/DataCard';
import { PERMISSION_TOPIC_ADMIN } from '../../../lib/auth';
import messages from '../../../resources/messages';
import Permissioned from '../../common/Permissioned';
import SourceOrCollectionChip from '../../common/SourceOrCollectionChip';

const localMessages = {
  title: { id: 'topic.summary.info.title', defaultMessage: 'About this Topic' },
  state: { id: 'topic.state', defaultMessage: 'State' },
};

const TopicInfo = (props) => {
  const { topic } = props;
  const { formatMessage } = props.intl;
  let stateMessage = '';
  if (topic.state !== 'error') {
    stateMessage = topic.message; // show details to everyone if in normal state
  } else {
    // only show error ugly stack trace to admin users
    stateMessage = (<Permissioned onlyTopic={PERMISSION_TOPIC_ADMIN}>{topic.message}</Permissioned>);
  }
  let sourcesAndCollections = topic.media ? [...topic.media] : [];
  sourcesAndCollections = topic.media_tags ? [...sourcesAndCollections, ...topic.media_tags] : sourcesAndCollections;
  return (
    <DataCard className="topic-info">
      <h2>
        <FormattedMessage {...localMessages.title} />
      </h2>
      <p>{topic.description}</p>
      <p>
        <b><FormattedMessage {...localMessages.state} /></b>: {topic.state }
        <br />
        {stateMessage}
      </p>
      <p>
        <b><FormattedMessage {...messages.topicPublicProp} /></b>: { topic.is_public ? formatMessage(messages.yes) : formatMessage(messages.no) }
        <br />
        <b><FormattedMessage {...messages.topicStartDateProp} /></b>: {topic.start_date}
        <br />
        <b><FormattedMessage {...messages.topicEndDateProp} /></b>: {topic.end_date}
      </p>
      <p>
        <b><FormattedHTMLMessage {...messages.topicQueryProp} /></b>
        <code>{topic.solr_seed_query}</code>
      </p>
      <p>
        <b><FormattedHTMLMessage {...messages.topicSourceCollectionsProp} /></b>
      </p>
      {sourcesAndCollections.map(object => <SourceOrCollectionChip object={object} />)}
      <p>
        <b><FormattedHTMLMessage {...messages.topicValidationProp} /></b>
        <code>{topic.pattern}</code>
      </p>
    </DataCard>
  );
};

TopicInfo.propTypes = {
  topic: React.PropTypes.object.isRequired,
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(TopicInfo);
