import React from 'react';
import { injectIntl } from 'react-intl';
import { Row } from 'react-flexbox-grid/lib';
import TopicListItem from './TopicListItem';

const TopicList = (props) => {
  const { topics, onChangeFavorited } = props;
  return (
    <Row>
      {topics.map(topic =>
        <TopicListItem key={topic.topics_id} topic={topic} onChangeFavorited={onChangeFavorited} />
      )}
    </Row>
  );
};

TopicList.propTypes = {
  topics: React.PropTypes.array.isRequired,
  intl: React.PropTypes.object.isRequired,
  onChangeFavorited: React.PropTypes.func.isRequired,
};

export default injectIntl(TopicList);
