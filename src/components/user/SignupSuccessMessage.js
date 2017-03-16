import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

const localMessages = {
  click: { id: 'error.cantLoad', defaultMessage: 'Clink the link we just emailed you' },
  emailCheck: { id: 'error.tryAgain', defaultMessage: 'To make sure your email is valid, we have sent you a message with a magic link for you to click.  Click the link in the email to confirm that we got your email right.' },
  sendAgain: { id: 'error.sendAgain', defaultMessage: 'Click here to send the email again' },
};

const SignupSuccessMessage = () => (
  <div className="user-login">
    <h1><FormattedMessage {...localMessages.click} /></h1>
    <p><FormattedMessage {...localMessages.emailCheck} /></p>
    <p><a href="/#/recover"><FormattedMessage {...localMessages.sendAgain} /></a></p>
  </div>
);


SignupSuccessMessage.propTypes = {
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(SignupSuccessMessage);
