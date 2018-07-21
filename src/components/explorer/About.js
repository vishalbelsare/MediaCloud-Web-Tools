import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import ExplorerMarketingFeatureList from './home/ExplorerMarketingFeatureList';

const localMessages = {
  aboutTitle: { id: 'about.title', defaultMessage: 'About Explorer' },
  aboutText: { id: 'about.text', defaultMessage: 'Explore our media tools!' },
};

const About = (props) => {
  const title = props.intl.formatMessage(localMessages.aboutTitle);
  const titleHandler = parentTitle => `${title} | ${parentTitle}`;
  return (
    <Grid>
      <Helmet><title>{titleHandler()}</title></Helmet>
      <div className="about-page">
        <Row>
          <Col lg={12}>
            <h1><FormattedMessage {...localMessages.aboutTitle} /></h1>
          </Col>
          <Col lg={12}>
            <ExplorerMarketingFeatureList />
          </Col>
        </Row>
      </div>
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
