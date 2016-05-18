import React from 'react';
import { injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';

const ControversySummary = (props) => {
  const { controversy } = props;
  return (
    <div>
      <Grid>
        <Row>
          <Col lg={12}>
            <h1>{controversy.name}</h1>
            <ul>
              <li>{controversy.description}</li>
              <li>Iterations: {controversy.num_iterations}</li>
              <li>process_with_bitly: {controversy.process_with_bitly}</li>
            </ul>
          </Col>
        </Row>
      </Grid>
    </div>
  );
};

ControversySummary.propTypes = {
  controversy: React.PropTypes.object.isRequired,
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(ControversySummary);
