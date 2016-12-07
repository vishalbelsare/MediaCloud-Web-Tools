import React from 'react';
import Title from 'react-title-component';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import Snackbar from 'material-ui/Snackbar';
// polyfill for Safari :-(
import intl from 'intl';  // eslint-disable-line
import intlEn from 'intl/locale-data/jsonp/en.js';  // eslint-disable-line
import BrandToolbar from './common/BrandToolbar';
import BrandMasthead from './common/BrandMasthead';
import messages from '../resources/messages';
import { getVersion } from '../config';
import { getBrandColors } from '../styles/colors';
import { updateFeedback } from '../actions/appActions';
import ErrorListContainer from './common/ErrorListContainer';

const localMessages = {
  supportEmail: { id: 'app.supportEmail', defaultMessage: 'Problems? email <a href="mailto:support@mediacloud.org">support@mediacloud.org</a>' },
};

const AppContainer = (props) => {
  const { children, feedback, handleSnackBarRequestClose, name, title, description, drawer, showLoginButton } = props;
  const { formatMessage } = props.intl;
  const brandColors = getBrandColors();
  return (
    <div className={`app-${name}`}>
      <Title render={formatMessage(messages.suiteName)} />
      <header>
        <BrandToolbar
          backgroundColor={brandColors.light}
          drawer={drawer}
        />
        <BrandMasthead
          name={title}
          description={description}
          backgroundColor={brandColors.dark}
          lightColor={brandColors.light}
          showLoginButton={showLoginButton}
        />
      </header>
      <ErrorListContainer />
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
          <FormattedHTMLMessage {...localMessages.supportEmail} />
          <br />
          v{getVersion()}
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
};

AppContainer.propTypes = {
  children: React.PropTypes.node,
  handleTouchTapLeftIconButton: React.PropTypes.func,
  intl: React.PropTypes.object.isRequired,
  // from state
  feedback: React.PropTypes.object.isRequired,
  // from dispatch
  handleSnackBarRequestClose: React.PropTypes.func.isRequired,
  // from parent
  name: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  description: React.PropTypes.string.isRequired,
  drawer: React.PropTypes.node,
  showLoginButton: React.PropTypes.bool,
};

AppContainer.contextTypes = {
  router: React.PropTypes.object.isRequired,
  store: React.PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  feedback: state.app.feedback,
});

const mapDispatchToProps = dispatch => ({
  handleSnackBarRequestClose: () => {
    dispatch(updateFeedback({ open: false, message: '' }));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      AppContainer
    )
  );
