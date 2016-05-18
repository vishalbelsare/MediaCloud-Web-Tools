import React from 'react';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';

const TopicSummary = (props) => {
  const { topic } = props;
  return (
    <div>
      <Row>
        <Col lg={12}>
          <h1>{topic.name}</h1>
          <ul>
            <li>{topic.description}</li>
            <li>Iterations: {topic.num_iterations}</li>
            <li>process_with_bitly: {topic.process_with_bitly}</li>
          </ul>
        </Col>
      </Row>
    </div>
  );
};

TopicSummary.propTypes = {
  topic: React.PropTypes.object.isRequired,
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(TopicSummary);
