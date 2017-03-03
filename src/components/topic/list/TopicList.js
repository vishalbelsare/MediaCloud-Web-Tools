import React from 'react';
import { injectIntl } from 'react-intl';
import { Row } from 'react-flexbox-grid/lib';
import TopicListItem from './TopicListItem';

const TopicList = (props) => {
  const { topics, onSetFavorited } = props;
  return (
    <Row>
      {topics.map(topic =>
        <TopicListItem key={topic.topics_id} topic={topic} onSetFavorited={onSetFavorited} />
      )}
    </Row>
  );
};

TopicList.propTypes = {
  topics: React.PropTypes.array.isRequired,
  intl: React.PropTypes.object.isRequired,
  onSetFavorited: React.PropTypes.func.isRequired,
};

export default injectIntl(TopicList);
