import PropTypes from 'prop-types';
import React from 'react';
import Title from 'react-title-component';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
// import ExplorerFaq from './faq/ExplorerFaq';

const localMessages = {
  aboutTitle: { id: 'about.title', defaultMessage: 'Explorer' },
  aboutText: { id: 'about.text', defaultMessage: 'Explore our media tools!' },
};

const About = (props) => {
  const title = props.intl.formatMessage(localMessages.aboutTitle);
  const titleHandler = parentTitle => `${title} | ${parentTitle}`;
  return (
    <Grid>
      <Title render={titleHandler} />
      <div className="about-page">
        <Row>
          <Col lg={12}>
            <h1><FormattedMessage {...localMessages.aboutTitle} /></h1>
            <p className="intro"><FormattedMessage {...localMessages.aboutText} /></p>
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
