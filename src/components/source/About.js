import React from 'react';
import Title from 'react-title-component';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import SourceManagerFaq from './faq/SourceManagerFaq';

const localMessages = {
  aboutTitle: { id: 'about.title', defaultMessage: 'About Source Manager' },
  aboutText: { id: 'about.text', defaultMessage: 'Source Manager lets you explore and manager the sources and collections that Media Cloud can analyze.' },
};

const About = (props) => {
  const title = props.intl.formatMessage(localMessages.aboutTitle);
  const titleHandler = parentTitle => `${title} | ${parentTitle}`;
  return (
    <Grid>
      <Title render={titleHandler} />
      <Row>
        <Col lg={6} md={6} sm={6}>
          <h1><FormattedMessage {...localMessages.aboutTitle} /></h1>
        </Col>
      </Row>
      <Row>
        <Col lg={6} md={6} sm={6}>
          <p><FormattedMessage {...localMessages.aboutText} /></p>
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <SourceManagerFaq />
        </Col>
      </Row>
    </Grid>
  );
};


About.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
};

export default
  injectIntl(
    About
  );
