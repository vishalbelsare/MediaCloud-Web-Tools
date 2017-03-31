import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';

const localMessages = {
  title: { id: 'topic.underConsutrction.title', defaultMessage: 'Under Construction' },
  text: { id: 'topic.underConsutrction.text', defaultMessage: 'We are still building this Topic for you. Check back soon to see if it is ready.' },
};

const TopicUnderConstruction = () => (
  <Grid>
    <Row>
      <Col lg={6} md={6} sm={6}>
        <h1><FormattedMessage {...localMessages.title} /></h1>
      </Col>
    </Row>
    <Row>
      <Col lg={6} md={6} sm={6}>
        <p><FormattedMessage {...localMessages.text} /></p>
      </Col>
    </Row>
  </Grid>
);

TopicUnderConstruction.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
};

export default
  injectIntl(
    TopicUnderConstruction
  );
