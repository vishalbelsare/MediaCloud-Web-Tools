import React from 'react';
import { grey200 } from 'material-ui/lib/styles/colors';
import { FormattedMessage, injectIntl } from 'react-intl';
import FlatButton from 'material-ui/lib/flat-button';

const messages = {
  controversyListTitle: { id: 'controversy.list.title', defaultMessage: 'Controversies' },
  errorCantLoad: { id: 'error.cantLoad', defaultMessage: "Can't load the data" },
  errorTryAgain: { id: 'error.tryAgain', defaultMessage: 'Try Again' }
};

class ErrorTryAgain extends React.Component {
  getStyles() {
    const styles = {
      root: {
        backgroundColor: grey200,
        textAlign: 'center',
        padding: 10
      }
    };
    return styles;
  }
  render() {
    const { onTryAgain } = this.props;
    const { formatMessage } = this.props.intl;
    const tryAgainMsg = formatMessage(messages.errorTryAgain);
    const styles = this.getStyles();
    return (
      <div style={styles.root}>
        <FormattedMessage {...messages.errorCantLoad}/>
        <br />
        <FlatButton label={tryAgainMsg} primary={true} onClick={onTryAgain}/>
      </div>
    );
  }
};

ErrorTryAgain.propTypes = {
  intl: React.PropTypes.object.isRequired,
  onTryAgain: React.PropTypes.func.isRequired
};

export default injectIntl(ErrorTryAgain);
