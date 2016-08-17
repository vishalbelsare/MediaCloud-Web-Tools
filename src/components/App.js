import React from 'react';
import Title from 'react-title-component';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import Snackbar from 'material-ui/Snackbar';
// polyfill for Safari :-(
import intl from 'intl';
import intlEn from 'intl/locale-data/jsonp/en.js';
import BrandToolbar from './common/BrandToolbar';
import BrandMasthead from './common/BrandMasthead';
import messages from '../resources/messages';
import { APP_NAME, VERSION } from '../config';
import { getBrandColors } from '../styles/colors';
import { updateFeedback } from '../actions/appActions';

class App extends React.Component {

  render() {
    const { children, feedback, handleSnackBarRequestClose } = this.props;
    const { formatMessage } = this.props.intl;
    const brandColors = getBrandColors();
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
      <div className={`app-${APP_NAME}`}>
        <Title render={formatMessage(messages.suiteName)} />
        <header>
          <BrandToolbar backgroundColor={brandColors.light} />
          <BrandMasthead
            name={formatMessage(toolNameMessage)}
            description={formatMessage(tooldescriptionMessage)}
            backgroundColor={brandColors.dark}
            lightColor={brandColors.light}
          />
        </header>
        <div id="content">
          {children}
        </div>
        <footer>
          <p><small>
            {'Created by the '}
            <a href="https://civic.mit.edu/">
              <FormattedMessage {...messages.c4cmName} />
            </a>
            {' and the '}
            <a href="https://cyber.law.harvard.edu">
              <FormattedMessage {...messages.berkmanName} />
            </a>.
            <br />
            v{VERSION}
          </small>
          </p>
        </footer>
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
