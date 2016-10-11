import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';

const LoadingSpinner = (props) => {
  const { size, padding } = props;
  const sizeToUse = ((size !== undefined) && (size !== null)) ? (size / 50) : 0.5;
  const customStyle = (padding !== undefined) ? { padding } : null;
  return (
    <div className="loading-spinner" style={customStyle}>
      <CircularProgress size={sizeToUse} />
    </div>
  );
};

LoadingSpinner.propTypes = {
  padding: React.PropTypes.number,
  size: React.PropTypes.number, // in pixels
};

export default LoadingSpinner;
