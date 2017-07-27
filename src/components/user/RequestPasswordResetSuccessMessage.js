import PropTypes from 'prop-types';
import React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { FormattedMessage, injectIntl } from 'react-intl';

const localMessages = {
  click: { id: 'success.email', defaultMessage: 'We have emailed you a link to reset your password' },
  emailCheck: { id: 'success.emailInfo', defaultMessage: 'We just emailed you a link to reset your password.  Click the link in your email.' },
  sendAgain: { id: 'error.sendAgain', defaultMessage: 'Click here to send the email again' },
};

const RequestPasswordResetSuccessMessage = () => (
  <div className="reset-password-confirm">
    <Grid>
      <Row>
        <Col lg={12}>
          <h1><FormattedMessage {...localMessages.click} /></h1>
          <p><FormattedMessage {...localMessages.emailCheck} /></p>
        </Col>
      </Row>
    </Grid>
  </div>
);


RequestPasswordResetSuccessMessage.propTypes = {
  intl: PropTypes.object.isRequired,
};

export default injectIntl(RequestPasswordResetSuccessMessage);
