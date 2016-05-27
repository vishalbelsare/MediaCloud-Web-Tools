import React from 'react';
import { injectIntl } from 'react-intl';

const TopicInfo = (props) => {
  const { topic } = props;
  return (
    <div>
      <h2>{topic.name}</h2>
      <ul>
        <li>{topic.description}</li>
        <li>Iterations: {topic.num_iterations}</li>
        <li>process_with_bitly: {topic.process_with_bitly}</li>
      </ul>
    </div>
  );
};

TopicInfo.propTypes = {
  topic: React.PropTypes.object.isRequired,
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(TopicInfo);
