import React from 'react';
import DocumentTitle from 'react-document-title';

import AppBar from 'material-ui/lib/app-bar';
import RaisedButton from 'material-ui/lib/raised-button';
import {Spacing} from 'material-ui/lib/styles';
import {darkWhite, grey200, grey400} from 'material-ui/lib/styles/colors';

import ThemeManager from 'material-ui/lib/styles/theme-manager';
import MediaMeterTheme from '../theme';

import AppLeftNav from './AppLeftNav';
import FullWidthSection from './FullWidthSection';

const App = React.createClass({

  //the key passed through context must be called "muiTheme"
  childContextTypes : {
    muiTheme: React.PropTypes.object,
  },

  contextTypes: {
    router: React.PropTypes.object.isRequired,
  },

  getInitialState() {
    return {
      leftNavOpen: false,
      leftNavDocked: false
    };
  },

  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(MediaMeterTheme),
    };
  },

  getStyles() {
    const styles = {
      root: {
        paddingTop: Spacing.desktopKeylineIncrement,
        minHeight: 400,
      },
      content: {
        margin: Spacing.desktopGutter,
      },
      footer: {
        backgroundColor: grey200,
        textAlign: 'center'
      },
      a: {
        color: grey400,
      },
      p: {
        margin: '0 auto',
        padding: 0,
        text: grey400,
        maxWidth: 356,
      },
      iconButton: {
        color: darkWhite,
      },
    };

    return styles;
  },

  handleTouchTapLeftIconButton() {
    console.log("clicked!")
    this.setState({
      leftNavOpen: !this.state.leftNavOpen,
    });
  },

  handleChangeRequestLeftNav(open) {
    this.setState({
      leftNavOpen: open,
    });
  },

  handleRequestChangeList(event, value) {
    console.log("handleRequestChangeList");
    this.context.router.push(value);
    this.setState({
      leftNavOpen: false,
    });
  },

  render() {
    const {
      location,
      children,
    } = this.props;

    let {
      leftNavOpen, leftNavDocked
    } = this.state;

    const router = this.context.router;
    const styles = this.getStyles();
    const title = "MediaMeter";

    return (
      <div>
        <DocumentTitle title={title}>
        </DocumentTitle>
        <AppBar
          onLeftIconButtonTouchTap={this.handleTouchTapLeftIconButton}
          title={title}
          zDepth={0}
          style={styles.appBar}
        />
        <AppLeftNav
          style={styles.leftNav}
          location={location}
          docked={leftNavDocked}
          onRequestChangeLeftNav={this.handleChangeRequestLeftNav}
          onRequestChangeList={this.handleRequestChangeList}
          open={leftNavOpen}
        />
        <FullWidthSection style={styles.footer}>
          <p style={styles.p}>
            {'Created by '}
            <a style={styles.a} href="https://civic.mit.edu/">
              MIT Center for Civic Media
            </a>
            {' and '}
            <a
              style={styles.a}
              href="https://cyber.law.harvard.edu"
            >
              Berkman Center for Internet and Society at Harvard University
            </a>.
          </p>
        </FullWidthSection>
      </div>
    );
  }  

});

export default App;