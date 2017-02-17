import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { ErrorNotice } from '../common/Notice';

const localMessages = {
  internalError: { id: 'errors.internal', defaultMessage: 'Internal Error' },
  notLoggedIn: { id: 'errors.notLoggedIn', defaultMessage: 'You need to login' },
  details: { id: 'errors.internal.details', defaultMessage: 'details' },
};

class ErrorItem extends React.Component {

  state = {
    showDetails: false,
  };

  render() {
    const { message } = this.props.error;
    const isLowLevelError = message.includes('.pm');  // includes a stack trace
    let messageContent = message;
    let detailsContent = null;
    if (isLowLevelError) {
      if (message.includes('Invalid API key or authentication cookie') || message.includes('Internal Server Error')) {
        messageContent = <FormattedMessage {...localMessages.notLoggedIn} />;
      } else {
        messageContent = <FormattedMessage {...localMessages.internalError} />;
      }
      detailsContent = message;
    }
    return (
      <div className="error-message">
        <ErrorNotice details={detailsContent}>
          {messageContent}
        </ErrorNotice>
      </div>
    );
  }

}

ErrorItem.propTypes = {
  intl: React.PropTypes.object.isRequired,
  error: React.PropTypes.object.isRequired,
};

export default
  injectIntl(
    ErrorItem
  );
