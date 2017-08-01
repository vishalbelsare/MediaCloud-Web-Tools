import PropTypes from 'prop-types';
import React from 'react';
import Title from 'react-title-component';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import SourceManagerFaq from './faq/SourceManagerFaq';

const localMessages = {
  aboutTitle: { id: 'about.title', defaultMessage: 'Source Manager' },
  aboutText: { id: 'about.text', defaultMessage: 'Browse the media sources and collections in our database, and suggest more to add.' },
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
        <Row>
          <Col lg={12}>
            <SourceManagerFaq />
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
