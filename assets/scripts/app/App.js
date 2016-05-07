import React from 'react';
import Title from 'react-title-component';

import { FormattedMessage, injectIntl } from 'react-intl';
import AppBar from 'material-ui/AppBar';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton/IconButton';
import InfoOutlineIcon from 'material-ui/svg-icons/action/info-outline';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import PersonIcon from 'material-ui/svg-icons/social/person';
import MenuItem from 'material-ui/MenuItem';
import { darkWhite, grey200, grey800 } from 'material-ui/styles/colors';
import { connect } from 'react-redux';

import FullWidthSection from '../components/FullWidthSection';

const messages = {
  footerC4CM: { id: 'footer.c4cm.name', defaultMessage: 'MIT Center for Civic Media' },
  footerBerkman: { id: 'footer.berkman.name', defaultMessage: 'Berkman Center for Internet and Society at Harvard University' },
  appTitle: { id: 'app.title', defaultMessage: 'MediaMeter' },
  appLogin: { id: 'app.login', defaultMessage: 'Login' },
  appAbout: { id: 'app.about', defaultMessage: 'About' },
  appLogout: { id: 'app.logout', defaultMessage: 'Logout' },
};

class App extends React.Component {

  getStyles() {
    const styles = {
      root: {
        minHeight: 400,
      },
      content: {
        margin: 20,
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

  handleRequestChangeListProxy(event, value) {
    this.context.router.push(value);
    this.props.handleRequestChangeList();
  }

  render() {
    const { location, children, user } = this.props;
    const { formatMessage } = this.props.intl;
    const styles = this.getStyles();
    let loginLogoutMenuItem = null;
    if (user.isLoggedIn) {
      loginLogoutMenuItem = <MenuItem primaryText={formatMessage(messages.appLogout)} value="/logout" leftIcon={<PersonIcon />} />;
    } else {
      loginLogoutMenuItem = <MenuItem primaryText={formatMessage(messages.appLogin)} value="/login" leftIcon={<PersonIcon />} />;
    }
    return (
      <div>
        <Title render={formatMessage(messages.appTitle)} />
        <AppBar
          title={formatMessage(messages.appTitle)}
          zDepth={0}
          iconElementRight={
            <div>
            <IconMenu
              iconButtonElement={ <IconButton><MoreVertIcon /></IconButton> }
              targetOrigin={ { horizontal: 'right', vertical: 'top' } }
              anchorOrigin={ { horizontal: 'right', vertical: 'top' } }
              valueLink= { { value: location.pathname, requestChange: this.handleRequestChangeListProxy } }
            >
              { loginLogoutMenuItem }
              <MenuItem primaryText={formatMessage(messages.appAbout)} value="/about" leftIcon={<InfoOutlineIcon />} />
            </IconMenu>
            </div>
          }
        />
        <div style={styles.root}>
          <div style={styles.content}>
            {children}
          </div>
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
  location: React.PropTypes.object.isRequired,
  handleTouchTapLeftIconButton: React.PropTypes.func,
  handleRequestChangeList: React.PropTypes.func,
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
