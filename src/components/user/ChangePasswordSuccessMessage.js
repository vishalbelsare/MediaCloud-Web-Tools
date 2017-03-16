import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

const localMessages = {
  email: { id: 'success.email', defaultMessage: 'We have emailed you a link to reset your password' },
  emailCheck: { id: 'success.emailInfo', defaultMessage: 'We just emailed you a link to reset your password.  Click the link in your email.' },
  sendAgain: { id: 'error.sendAgain', defaultMessage: 'Click here to send the email again' },
};

const ChangePasswordSuccessMessage = () => (
  <div className="user-login">
    <h1><FormattedMessage {...localMessages.email} /></h1>
    <p><FormattedMessage {...localMessages.emailCheck} /></p>
    <p><a href="/#/recover"><FormattedMessage {...localMessages.sendAgain} /></a></p>
  </div>
);


ChangePasswordSuccessMessage.propTypes = {
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(ChangePasswordSuccessMessage);
