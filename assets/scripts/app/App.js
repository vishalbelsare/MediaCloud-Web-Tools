import React from 'react';
import Title from 'react-title-component';

import {FormattedMessage} from 'react-intl';
import AppBar from 'material-ui/lib/app-bar';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import IconButton from 'material-ui/lib/icon-button';
import PersonIcon from 'material-ui/lib/svg-icons/social/person';
import MenuItem from 'material-ui/lib/menus/menu-item';
import { Spacing } from 'material-ui/lib/styles';
import { darkWhite, grey200, grey400 } from 'material-ui/lib/styles/colors';
import { connect } from 'react-redux';
import { StyleResizable } from 'material-ui/lib/mixins';

import ThemeManager from 'material-ui/lib/styles/theme-manager';
import MediaMeterTheme from '../theme';

import ControllableAppLeftNav from './AppLeftNav';
import FullWidthSection from '../components/FullWidthSection';
import { openLeftNav, dockLeftNav } from './appActions';

const App = React.createClass({

  propTypes: {
    children: React.PropTypes.node,
    location: React.PropTypes.object.isRequired,
    handleTouchTapLeftIconButton: React.PropTypes.func,
    handleRequestChangeList: React.PropTypes.func
  },

  mixins: [
    StyleResizable
  ],

  contextTypes: {
    router: React.PropTypes.object.isRequired,
    store: React.PropTypes.object.isRequired
  },

  //the key passed through context must be called "muiTheme"
  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(MediaMeterTheme)
    };
  },

  getStyles() {
    const styles = {
      root: {
        minHeight: 400
      },
      content: {
        margin: Spacing.desktopGutter
      },
      footer: {
        backgroundColor: grey200,
        textAlign: 'center'
      },
      a: {
        color: grey400
      },
      p: {
        margin: '0 auto',
        padding: 0,
        text: grey400,
        maxWidth: 356
      },
      iconButton: {
        color: darkWhite
      }
    };

    return styles;
  },

  componentDidMount() {
    if (this.isDeviceSize(StyleResizable.statics.Sizes.MEDIUM) ||
        this.isDeviceSize(StyleResizable.statics.Sizes.LARGE)) {
      this.context.state.dispatch(openLeftNav(true));
      this.context.state.dispatch(dockLeftNav(true));
    }
  },

  handleRequestChangeListProxy(event, value) {
    this.context.router.push(value);
    this.props.handleRequestChangeList();
  },

  render() {
    const {
      location,
      children
    } = this.props;

    const styles = this.getStyles();
    const title = 'MediaMeter';

    return (
      <div>
        <Title render={title} />
        <AppBar
          onLeftIconButtonTouchTap={this.props.handleTouchTapLeftIconButton}
          title={title}
          zDepth={0}
          style={styles.appBar}
          iconElementRight={
            <IconMenu
              iconButtonElement={
                <IconButton><PersonIcon /></IconButton>
              }
              targetOrigin={ { horizontal: 'right', vertical: 'top' } }
              anchorOrigin={ { horizontal: 'right', vertical: 'top' } }
              valueLink= { { value: location.pathname, requestChange: this.handleRequestChangeListProxy } }
            >
              <MenuItem primaryText='Logout' value='/logout' />
            </IconMenu>
          }
        />
        <div style={styles.root}>
          <div style={styles.content}>
            {children}
          </div>
        </div>
        <ControllableAppLeftNav
          style={styles.leftNav}
          location={location}
          onRequestChangeList={this.handleRequestChangeListProxy}
        />
        <FullWidthSection style={styles.footer}>
          <p style={styles.p}>
            {'Created by '}
            <a style={styles.a} href='https://civic.mit.edu/'>
              <FormattedMessage id="footer.c4cm.name" defaultMessage="MIT Center for Civic Media"/>
            </a>
            {' and '}
            <a
              style={styles.a}
              href='https://cyber.law.harvard.edu'
            >
              <FormattedMessage id="footer.berkman.name" defaultMessage="Berkman Center for Internet and Society at Harvard University"/>
            </a>.
          </p>
        </FullWidthSection>
      </div>
    );
  }

});

const mapDispatchToProps = function (dispatch) {
  return {
    handleTouchTapLeftIconButton: () => {
      dispatch(openLeftNav(true));
    },
    handleRequestChangeList: () => {
      dispatch(openLeftNav(false));
    }
  };
};

const ControllableApp = connect(
  null,
  mapDispatchToProps
)(App);

export default ControllableApp;
