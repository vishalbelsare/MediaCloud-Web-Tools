import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { ErrorButton } from '../common/IconButton';

const localMessages = {
  internalError: { id: 'errors.internal', defaultMessage: 'Internal Error 💣' },
  notLoggedIn: { id: 'errors.notLoggedIn', defaultMessage: 'You need to login' },
  details: { id: 'errors.internal.details', defaultMessage: 'details' },
};

class ErrorItem extends React.Component {

  state = {
    showDetails: false,
  };

  render() {
    const { message } = this.props.error;
    const { formatMessage } = this.props.intl;
    const isLowLevelError = message.includes('.pm');  // includes a stack trace
    let messageContent = message;
    let detailsContent = null;
    if (isLowLevelError) {
      if (message.includes('Invalid API key or authentication cookie')) {
        messageContent = <FormattedMessage {...localMessages.notLoggedIn} />;
      } else {
        messageContent = <FormattedMessage {...localMessages.internalError} />;
      }
      let smallContent = null;
      if (this.state.showDetails) {
        smallContent = <div><small>{message}</small></div>;
      }
      detailsContent = (
        <span>
          <a
            href={`#${formatMessage(localMessages.details)}`}
            onClick={(evt) => {
              evt.preventDefault();
              this.setState({ showDetails: !this.state.showDetails });
            }}
          >
            <FormattedMessage {...localMessages.details} />
          </a>
          {smallContent}
        </span>
      );
    }
    return (
      <div className="error-message">
        <ErrorButton color="#ff0000" />
        &nbsp;
        {messageContent}
        {detailsContent}
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
