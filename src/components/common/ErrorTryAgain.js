import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import { grey400 } from 'material-ui/styles/colors';
import { FormattedMessage, injectIntl } from 'react-intl';

const localMessages = {
  errorCantLoad: { id: 'error.cantLoad', defaultMessage: "Can't load the data" },
  errorTryAgain: { id: 'error.tryAgain', defaultMessage: 'Try Again' },
};

class ErrorTryAgain extends React.Component {
  getStyles() {
    const { padding } = this.props;
    const styles = {
      root: {
        textAlign: 'center',
        padding: (padding !== null) ? padding : 10,
      },
      p: {
        color: grey400,
      },
    };
    return styles;
  }
  render() {
    const { onTryAgain } = this.props;
    const { formatMessage } = this.props.intl;
    const tryAgainMsg = formatMessage(localMessages.errorTryAgain);
    const styles = this.getStyles();
    return (
      <div style={styles.root}>
        <p style={styles.p}><FormattedMessage {...localMessages.errorCantLoad} /></p>
        <FlatButton label={tryAgainMsg} primary onClick={onTryAgain} />
      </div>
    );
  }
}

ErrorTryAgain.propTypes = {
  intl: React.PropTypes.object.isRequired,
  onTryAgain: React.PropTypes.func.isRequired,
  padding: React.PropTypes.number,
};

export default injectIntl(ErrorTryAgain);
