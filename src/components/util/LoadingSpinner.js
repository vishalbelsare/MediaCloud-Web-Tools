import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';

class LoadingSpinner extends React.Component {
  getStyles() {
    const { padding } = this.props;
    const paddingToUse = (padding !== undefined) ? padding : 10;
    const styles = {
      root: {
        textAlign: 'center',
        padding: paddingToUse,
      },
    };
    return styles;
  }
  render() {
    const { size } = this.props;
    const sizeToUse = (size !== undefined) ? (size / 50) : 0.5;
    const styles = this.getStyles();
    return (
      <div style={styles.root}>
        <CircularProgress size={sizeToUse} />
      </div>
    );
  }
}

LoadingSpinner.propTypes = {
  padding: React.PropTypes.number,
  size: React.PropTypes.number, // in pixels
};

export default LoadingSpinner;
