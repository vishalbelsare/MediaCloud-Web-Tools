import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import ExplorerMarketingFeatureList from './home/ExplorerMarketingFeatureList';
import messages from '../../resources/messages';

const localMessages = {
  aboutTitle: { id: 'about.title', defaultMessage: 'About Explorer' },
  aboutText: { id: 'about.text', defaultMessage: 'Explore our media tools!' },
};

const About = (props) => {
  const title = props.intl.formatMessage(localMessages.aboutTitle);
  return (
    <div className="about">
      <Grid>
        <Helmet><title>{title}</title></Helmet>
        <Row>
          <Col lg={12}>
            <h1><FormattedMessage {...localMessages.aboutTitle} /></h1>
          </Col>
          <Row>
            <Col lg={12}>
              <p className="subtitle"><FormattedMessage {...messages.explorerToolDescription} /></p>
            </Col>
          </Row>
          <Col lg={12}>
            <ExplorerMarketingFeatureList />
          </Col>
        </Row>
      </Grid>
    </div>
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
