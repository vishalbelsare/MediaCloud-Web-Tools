import React from 'react';
import Title from 'react-title-component';

import { FormattedMessage, injectIntl } from 'react-intl';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import { darkWhite, grey200, grey800 } from 'material-ui/styles/colors';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';

import FullWidthSection from '../components/FullWidthSection';

const messages = {
  footerC4CM: { id: 'footer.c4cm.name', defaultMessage: 'MIT Center for Civic Media' },
  footerBerkman: { id: 'footer.berkman.name', defaultMessage: 'Berkman Center for Internet and Society at Harvard University' },
  appTitle: { id: 'app.title', defaultMessage: 'MediaMeter Topic Mapper' },
  appLogin: { id: 'app.login', defaultMessage: 'Login' },
  appLogout: { id: 'app.logout', defaultMessage: 'Logout' },
};

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
    let loginLogoutButton = null;
    if (user.isLoggedIn) {
      loginLogoutButton = <FlatButton label={formatMessage(messages.appLogout)} onTouchTap={this.onRouteToLogout} />;
    } else {
      loginLogoutButton = <FlatButton label={formatMessage(messages.appLogin)} onTouchTap={this.onRouteToLogin} />;
    }
    return (
      <div>
        <Title render={formatMessage(messages.appTitle)} />
        <AppBar
          title={formatMessage(messages.appTitle)}
          zDepth={0}
          iconELementLeft={<div></div>}
          iconElementRight={loginLogoutButton}
        />
        <div style={styles.root}>
          <Grid>
            <Row>
              <Col lg={12}>
                {children}
              </Col>
            </Row>
          </Grid>
        </div>
        <FullWidthSection style={styles.footer}>
          <p style={styles.p}><small>
            {'Created by '}
            <a style={styles.a} href="https://civic.mit.edu/">
              <FormattedMessage {...messages.footerC4CM} />
            </a>
            {' and '}
            <a
              style={styles.a}
              href="https://cyber.law.harvard.edu"
            >
              <FormattedMessage {...messages.footerBerkman} />
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
