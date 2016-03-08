import React from 'react';
import AppBar from 'material-ui/lib/app-bar';
import RaisedButton from 'material-ui/lib/raised-button';

import ThemeManager from 'material-ui/lib/styles/theme-manager';
import MediaMeterTheme from './theme';

const MediaMeterAppComponent = React.createClass({

  //the key passed through context must be called "muiTheme"
  childContextTypes : {
    muiTheme: React.PropTypes.object,
  },

  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(MediaMeterTheme),
    };
  },

  //the app bar and button will receive our theme through
  //context and style accordingly
  render () {
    return (
      <div>
        <AppBar title="My AppBar" />
        <RaisedButton label="My Button" primary={true} />
      </div>
    );
  },
});

export default MediaMeterAppComponent;