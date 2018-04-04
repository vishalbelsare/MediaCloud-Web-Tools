import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { assetUrl } from '../../lib/assetUtil';

const localMessages = {
  title: { id: 'topic.underConsutrction.title', defaultMessage: 'Check back soon!' },
  text: { id: 'topic.underConsutrction.text', defaultMessage: 'Your nmodifed topic is undergoing a refresh. Check back soon to see if it is ready.' },
};

const TopicReconstruction = props => (
  <Grid>
    <Row>
      <Col lg={12}>
        <h1><FormattedMessage {...localMessages.title} /></h1>
      </Col>
    </Row>
    <Row>
      <Col lg={12}>
        <p><FormattedMessage {...localMessages.text} /></p>
        <img
          alt={props.intl.formatMessage(localMessages.title)}
          src={assetUrl('/static/img/wait-for-it-cat.gif')}
        />
      </Col>
    </Row>
  </Grid>
);

TopicReconstruction.propTypes = {
  // from context
  intl: PropTypes.object.isRequired,
};

export default
  injectIntl(
    TopicReconstruction
  );
