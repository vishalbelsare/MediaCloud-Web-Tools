import React from 'react';

import CircularProgress from 'material-ui/lib/circular-progress';

const LoadingSpinner = (props) => {
  return (
    <div>
      <CircularProgress />
    </div>
  );
};

export default LoadingSpinner;