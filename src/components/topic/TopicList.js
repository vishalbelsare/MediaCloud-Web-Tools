import React from 'react';
import { injectIntl } from 'react-intl';
import Link from 'react-router/lib/Link';
import { Row, Col } from 'react-flexbox-grid/lib';
import DataCard from '../common/DataCard';

const TopicListItem = (props) => {
  const { topic } = props;
  const disable = (topic.state !== 'ready');
  let title = null;
  if (disable) {
    title = topic.name;
  } else {
    title = <Link to={`/topics/${topic.topics_id}/summary`}>{topic.name}</Link>;
  }
  return (
    <Col xs={12} sm={6} md={3} lg={3}>
      <DataCard disabled={disable}>
        <h3>{title}</h3>
        <p><i>{topic.description}</i></p>
        <p><small>{topic.state}</small></p>
      </DataCard>
    </Col>
  );
};

TopicListItem.propTypes = {
  topic: React.PropTypes.object.isRequired,
};

const TopicList = (props) => {
  const { topics } = props;
  return (
    <Row>
    {topics.map(topic =>
      <TopicListItem key={topic.topics_id} topic={topic} />
    )}
    </Row>
  );
};

TopicList.propTypes = {
  topics: React.PropTypes.array.isRequired,
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(TopicList);
