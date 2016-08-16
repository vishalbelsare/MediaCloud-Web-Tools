import React from 'react';
import Title from 'react-title-component';
import { FormattedMessage, injectIntl } from 'react-intl';
import { darkWhite, grey200, grey800 } from 'material-ui/styles/colors';
import { connect } from 'react-redux';
import Snackbar from 'material-ui/Snackbar';
// polyfill for Safari :-(
import intl from 'intl';
import intlEn from 'intl/locale-data/jsonp/en.js';
import BrandToolbar from './common/BrandToolbar';
import BrandMasthead from './common/BrandMasthead';
import messages from '../resources/messages';
import { APP_NAME } from '../config';
import { BRAND_COLORS } from '../styles/colors';
import { updateFeedback } from '../actions/appActions';
import { VERSION } from '../config';

class App extends React.Component {

  getStyles() {
    const styles = {
      root: {
        minHeight: 400,
        marginBottom: 20,
      },
      footer: {
        backgroundColor: grey200,
        textAlign: 'center',
        paddingTop: 30,
        paddingBottom: 30,
      },
      a: {
        color: grey800,
      },
      p: {
        margin: '0 auto',
        padding: 0,
        text: grey800,
        maxWidth: 356,
      },
      iconButton: {
        color: darkWhite,
      },
    };
    return styles;
  }

  render() {
    const { children, feedback, handleSnackBarRequestClose } = this.props;
    const { formatMessage } = this.props.intl;
    const styles = this.getStyles();
    const brandColors = BRAND_COLORS[APP_NAME];
    let toolNameMessage = null;
    let tooldescriptionMessage = null;
    switch (APP_NAME) {
      case 'sources':
        toolNameMessage = messages.sourcesToolName;
        tooldescriptionMessage = messages.sourcesToolDescription;
        break;
      case 'topics':
        toolNameMessage = messages.topicsToolName;
        tooldescriptionMessage = messages.topicsToolDescription;
        break;
      default:
        toolNameMessage = messages.error;
        tooldescriptionMessage = messages.error;
    }
    return (
      <div>
        <Title render={formatMessage(messages.suiteName)} />
        <header>
          <BrandToolbar backgroundColor={brandColors.light} />
          <BrandMasthead name={formatMessage(toolNameMessage)}
            description={formatMessage(tooldescriptionMessage)}
            backgroundColor={brandColors.dark}
            lightColor={brandColors.light}
          />
        </header>
        <div style={styles.root}>
          {children}
        </div>
        <div style={styles.footer}>
          <p style={styles.p}><small>
            {'Created by the '}
            <a style={styles.a} href="https://civic.mit.edu/">
              <FormattedMessage {...messages.c4cmName} />
            </a>
            {' and the '}
            <a style={styles.a} href="https://cyber.law.harvard.edu">
              <FormattedMessage {...messages.berkmanName} />
            </a>.
            <br />
            v{VERSION}
          </small>
          </p>
        </div>
        <Snackbar
          open={feedback.open}
          message={feedback.message}
          autoHideDuration={4000}
          onRequestClose={handleSnackBarRequestClose}
        />
      </div>
    );
  }

}

App.propTypes = {
  children: React.PropTypes.node,
  handleTouchTapLeftIconButton: React.PropTypes.func,
  intl: React.PropTypes.object.isRequired,
  // from state
  feedback: React.PropTypes.object.isRequired,
  // from dispatch
  handleSnackBarRequestClose: React.PropTypes.func.isRequired,
};

App.contextTypes = {
  router: React.PropTypes.object.isRequired,
  store: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  feedback: state.app.feedback,
});

const mapDispatchToProps = (dispatch) => ({
  handleSnackBarRequestClose: () => {
    dispatch(updateFeedback({ open: false, message: '' }));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      App
    )
  );
