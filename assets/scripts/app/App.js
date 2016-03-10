import React from 'react';
import DocumentTitle from 'react-document-title';

import AppBar from 'material-ui/lib/app-bar';
import RaisedButton from 'material-ui/lib/raised-button';
import {Spacing} from 'material-ui/lib/styles';
import {darkWhite, grey200, grey400} from 'material-ui/lib/styles/colors';
import { connect } from 'react-redux'

import ThemeManager from 'material-ui/lib/styles/theme-manager';
import MediaMeterTheme from '../theme';

import ControllableAppLeftNav from './AppLeftNav';
import FullWidthSection from '../components/FullWidthSection';
import leftNavVisibility from './actions'

const App = React.createClass({

  propTypes: {
    handleTouchTapLeftIconButton: React.PropTypes.func
  },

  //the key passed through context must be called "muiTheme"
  childContextTypes : {
    muiTheme: React.PropTypes.object,
  },

  contextTypes: {
    router: React.PropTypes.object.isRequired,
    store: React.PropTypes.object.isRequired
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

  handleRequestChangeList(event, value) {
    this.context.router.push(value);
    this.context.store.dispatch(leftNavVisibility(false));
    /*this.setState({
      leftNavOpen: false,
    });*/
  },

  render() {
    console.log("RENDER");
    const {
      location,
      children,
    } = this.props;

    const router = this.context.router;
    const styles = this.getStyles();
    const title = "MediaMeter";
    console.log(this.context.store.getState());
    const leftNavOpen = this.context.store.getState().leftNavVisibility;

    return (
      <div>
        <DocumentTitle title={title}>
        </DocumentTitle>
        <AppBar
          onLeftIconButtonTouchTap={this.props.handleTouchTapLeftIconButton}
          title={title}
          zDepth={0}
          style={styles.appBar}
        />
        <ControllableAppLeftNav
          style={styles.leftNav}
          location={location}
          docked={false}
          onRequestChangeList={this.handleRequestChangeList}
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

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleTouchTapLeftIconButton: (open) => {
      dispatch(leftNavVisibility(true))
    }
  }
}

const ControllableApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

export default ControllableApp;
