import React from 'react';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';

const ControversySummary = (props) => {
  const { controversy } = props;
  return (
    <Row>
      <Col lg={12}>
        <h1>{controversy.name}</h1>
        <p>
        <ul>
          <li>{controversy.description}</li>
          <li>Iterations: {controversy.num_iterations}</li>
          <li>process_with_bitly: {controversy.process_with_bitly}</li>
          <li>Dumps: {controversy.dumps.length}</li>
        </ul>
        </p>
      </Col>
    </Row>
  );
};

ControversySummary.propTypes = {
  controversy: React.PropTypes.object.isRequired,
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(ControversySummary);
