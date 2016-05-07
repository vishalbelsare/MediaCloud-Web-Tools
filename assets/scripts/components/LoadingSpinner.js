import React from 'react';

import CircularProgress from 'material-ui/CircularProgress';

class LoadingSpinner extends React.Component {
  getStyles() {
    const styles = {
      root: {
        textAlign: 'center',
        padding: 10,
      },
    };
    return styles;
  }
  render() {
    const styles = this.getStyles();
    return (
      <div style={styles.root}>
        <CircularProgress />
      </div>
    );
  }
}

export default LoadingSpinner;
