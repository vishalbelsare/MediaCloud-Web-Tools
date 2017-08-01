import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { FormattedMessage, injectIntl } from 'react-intl';

const localMessages = {
  title: { id: 'error.cantLoad', defaultMessage: 'Check your email' },
  intro: { id: 'error.tryAgain', defaultMessage: 'We send an magic activation link to you again.  You need to click the link in the email to verify you are a real person and activate your Media Cloud account.' },
  sendAgain: { id: 'error.sendAgain', defaultMessage: 'Still didn\'t get it? Send it again.' },
};

const ResendActivationSuccess = () => (
  <div className="signup-confirm">
    <Grid>
      <Row>
        <Col lg={12}>
          <h1><FormattedMessage {...localMessages.title} /></h1>
          <p><FormattedMessage {...localMessages.intro} /></p>
          <p><Link to="/user/resend-activation"><FormattedMessage {...localMessages.sendAgain} /></Link></p>
        </Col>
      </Row>
    </Grid>
  </div>
);


ResendActivationSuccess.propTypes = {
  intl: PropTypes.object.isRequired,
};

export default injectIntl(ResendActivationSuccess);
