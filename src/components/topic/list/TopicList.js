import React from 'react';
import { injectIntl } from 'react-intl';
import TopicIcon from '../../common/icons/TopicIcon';
import ContentPreview from '../../common/ContentPreview';
import { PERMISSION_TOPIC_NONE } from '../../../lib/auth';

const TopicList = (props) => {
  const { topics, onSetFavorited } = props;
  return (
    <ContentPreview
      items={topics}
      onSetFavorited={onSetFavorited}
      classStyle="topic-list"
      icon={<TopicIcon height={25} />}
      linkInfo={t => `topics/${t.topics_id}/summary`}
      linkDisplay={t => t.name}
      disabled={t => t.user_permission === PERMISSION_TOPIC_NONE}
    />
  );
};

TopicList.propTypes = {
  topics: React.PropTypes.array.isRequired,
  showFavorites: React.PropTypes.bool,
  intl: React.PropTypes.object.isRequired,
  onSetFavorited: React.PropTypes.func.isRequired,
};

export default injectIntl(TopicList);
