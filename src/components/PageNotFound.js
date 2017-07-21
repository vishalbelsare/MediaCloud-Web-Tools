import React from 'react';
import Title from 'react-title-component';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';

const localMessages = {
  title: { id: 'about.title', defaultMessage: 'Page Not Found' },
  intro: { id: 'about.text', defaultMessage: 'That isn\'t a valid URL!' },
};

const PageNotFound = (props) => {
  const title = props.intl.formatMessage(localMessages.title);
  const titleHandler = parentTitle => `${title} | ${parentTitle}`;
  return (
    <Grid>
      <Title render={titleHandler} />
      <Row>
        <Col lg={6} md={6} sm={6}>
          <h1><FormattedMessage {...localMessages.title} /></h1>
        </Col>
      </Row>
      <Row>
        <Col lg={6} md={6} sm={6}>
          <p><FormattedMessage {...localMessages.intro} /></p>
        </Col>
      </Row>
    </Grid>
  );
};


PageNotFound.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
};

export default
  injectIntl(
    PageNotFound
  );
