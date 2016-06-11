import React from 'react';
import Title from 'react-title-component';
import { FormattedMessage, injectIntl } from 'react-intl';
import BrandToolbar from './branding/BrandToolbar';
import BrandMasthead from './branding/BrandMasthead';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import { darkWhite, grey200, grey800 } from 'material-ui/styles/colors';
import { connect } from 'react-redux';
import messages from '../resources/messages';
import FullWidthSection from '../components/util/FullWidthSection';
import { APP_NAME } from '../config';
import { BRAND_COLORS } from '../styles/colors';

class App extends React.Component {

  onRouteToLogout = () => {
    this.context.router.push('/logout');
  }

  onRouteToLogin = () => {
    this.context.router.push('/logout');
  }

  getStyles() {
    const styles = {
      root: {
        minHeight: 400,
        marginBottom: 20,
      },
      footer: {
        backgroundColor: grey200,
        textAlign: 'center',
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
    const { children, user } = this.props;
    const { formatMessage } = this.props.intl;
    const styles = this.getStyles();
    const brandColors = BRAND_COLORS[APP_NAME];
    let toolNameMessage = null;
    let tooldescriptionMessage = null;
    switch( APP_NAME ){
      case 'sources':
        toolNameMessage = messages.sourcesToolName;
        tooldescriptionMessage = messages.sourcesToolDescription;
        break;
      case 'topics':
        toolNameMessage = messages.topicsToolName;
        tooldescriptionMessage = messages.topicsToolDescription;
        break;
    }
    let loginLogoutButton = null;
    if (user.isLoggedIn) {
      loginLogoutButton = <FlatButton label={formatMessage(messages.userLogout)} onTouchTap={this.onRouteToLogout} />;
    } else {
      loginLogoutButton = <FlatButton label={formatMessage(messages.userLogin)} onTouchTap={this.onRouteToLogin} />;
    }
    return (
      <div>
        <Title render={formatMessage(messages.appTitle)} />
        <header>
          <BrandToolbar backgroundColor={brandColors.light} />
          <BrandMasthead name={formatMessage(toolNameMessage)}
            description={formatMessage(tooldescriptionMessage)}
            backgroundColor={brandColors.dark}
          />
        </header>
        <AppBar
          title={formatMessage(messages.appTitle)}
          zDepth={0}
          iconELementLeft={<div></div>}
          iconElementRight={loginLogoutButton}
        />
        <div style={styles.root}>
          {children}
        </div>
        <FullWidthSection style={styles.footer}>
          <p style={styles.p}><small>
            {'Created by '}
            <a style={styles.a} href="https://civic.mit.edu/">
              <FormattedMessage {...messages.c4cmName} />
            </a>
            {' and '}
            <a style={styles.a} href="https://cyber.law.harvard.edu">
              <FormattedMessage {...messages.berkmanName} />
            </a>.
          </small>
          </p>
        </FullWidthSection>
      </div>
    );
  }

}

App.propTypes = {
  children: React.PropTypes.node,
  handleTouchTapLeftIconButton: React.PropTypes.func,
  intl: React.PropTypes.object.isRequired,
  user: React.PropTypes.object.isRequired,
};

App.contextTypes = {
  router: React.PropTypes.object.isRequired,
  store: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default injectIntl(connect(mapStateToProps, null)(App));
