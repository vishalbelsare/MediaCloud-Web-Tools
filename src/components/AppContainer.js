import PropTypes from 'prop-types';
import React from 'react';
import Title from 'react-title-component';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import Snackbar from 'material-ui/Snackbar';
// polyfill for Safari :-(
import intl from 'intl';  // eslint-disable-line
import intlEn from 'intl/locale-data/jsonp/en.js';  // eslint-disable-line
import { Row } from 'react-flexbox-grid/lib';
import AppHeader from './common/header/AppHeader';
import messages from '../resources/messages';
import { getVersion } from '../config';
import { getBrandColors } from '../styles/colors';
import { updateFeedback } from '../actions/appActions';
import { ErrorNotice } from './common/Notice';
import { assetUrl } from '../lib/assetUtil';

const localMessages = {
  supportOptions: { id: 'app.supportOptions', defaultMessage: 'Need help? Join our <a href="https://groups.io/g/mediacloud">discussion group</a><br />or email <a href="mailto:support@mediacloud.org">support@mediacloud.org</a>.' },
  maintenance: { id: 'app.maintenance', defaultMessage: 'Sorry, we have taken our system down right now for maintenance' },
};

const AppContainer = (props) => {
  const { children, feedback, subHeader, handleSnackBarRequestClose, name, title, description, drawer, showLoginButton } = props;
  const { formatMessage } = props.intl;
  const brandColors = getBrandColors();

  let content = children;
  if (document.appConfig.online === false) {
    content = (
      <div className="maintenance">
        <Row center="lg">
          <ErrorNotice>
            <br /><br />
            <FormattedMessage {...localMessages.maintenance} />
            <br /><br />
            <img alt="under-constrction" src={assetUrl('/static/img/under-construction.gif')} />
            <br /><br />
          </ErrorNotice>
        </Row>
      </div>
    );
  }

  return (
    <div className={`app-contiainer app-${name}`}>
      <Title render={formatMessage(messages.suiteName)} />
      <header>
        <AppHeader
          name={title}
          description={description}
          backgroundColor={brandColors.dark}
          lightColor={brandColors.light}
          showLoginButton={showLoginButton}
          drawer={drawer}
          subHeader={subHeader}
        />
      </header>
      <div id="content">
        {content}
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
          <FormattedHTMLMessage {...localMessages.supportOptions} />
          <br />
          v{getVersion()}
        </small>
        </p>
      </footer>
      <Snackbar
        open={feedback.open}
        message={feedback.message}
        autoHideDuration={8000}
        onRequestClose={handleSnackBarRequestClose}
      />
    </div>
  );
};

AppContainer.propTypes = {
  children: PropTypes.node,
  handleTouchTapLeftIconButton: PropTypes.func,
  intl: PropTypes.object.isRequired,
  // from state
  feedback: PropTypes.object.isRequired,
  // from dispatch
  handleSnackBarRequestClose: PropTypes.func.isRequired,
  // from parent
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  drawer: PropTypes.node,
  showLoginButton: PropTypes.bool,
  subHeader: PropTypes.node,
};

AppContainer.contextTypes = {
  router: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
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
