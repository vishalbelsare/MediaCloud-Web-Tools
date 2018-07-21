import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import TopicsMarketingFeatureList from './homepage/TopicsMarketingFeatureList';

const localMessages = {
  aboutTitle: { id: 'about.title', defaultMessage: 'About Topic Mapper' },
  aboutText: { id: 'about.text', defaultMessage: 'Topic Mapper lets you analyze how online media talks about a topic.' },
};

const About = (props) => {
  const title = props.intl.formatMessage(localMessages.aboutTitle);
  const titleHandler = parentTitle => `${title} | ${parentTitle}`;
  return (
    <Grid>
      <Helmet><title>{titleHandler()}</title></Helmet>
      <Row>
        <Col lg={6} md={6} sm={6}>
          <h1><FormattedMessage {...localMessages.aboutTitle} /></h1>
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <TopicsMarketingFeatureList />
        </Col>
      </Row>
    </Grid>
  );
};


About.propTypes = {
  // from context
  intl: PropTypes.object.isRequired,
};

export default
  injectIntl(
    About
  );
