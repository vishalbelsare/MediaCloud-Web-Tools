import React from 'react';
import RefreshIndicator from 'material-ui/RefreshIndicator';

class LoadingSpinner extends React.Component {
  getStyles() {
    const styles = {
      root: {
        textAlign: 'center',
        padding: 10,
      },
      refresh: {
        display: 'inline-block',
        position: 'relative',
      },
    };
    return styles;
  }
  render() {
    const styles = this.getStyles();
    return (
      <div style={styles.root}>
        <RefreshIndicator
          size={40}
          left={10}
          top={0}
          status="loading"
          style={styles.refresh}
        />
      </div>
    );
  }
}

export default LoadingSpinner;
