import React from 'react';

const CloseIcon = props => (
  <div className="app-icon app-icon-medium app-icon-close" style={{ backgroundColor: props.backgroundColor }}>
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999 xlink" x="0px" y="0px" width="7.087px" height="7.079px" viewBox="0 0 7.087 7.079" enableBackground="new 0 0 7.087 7.079" xmlSpace="preserve">
      <path fill="#FFFFFF" d="M6.964,6.084L4.419,3.54l2.545-2.545C7.16,0.799,7.122,0.444,6.88,0.204 C6.639-0.039,6.285-0.078,6.089,0.118L3.544,2.664L0.999,0.118c-0.196-0.195-0.55-0.156-0.792,0.086 c-0.241,0.24-0.279,0.596-0.084,0.791L2.668,3.54L0.123,6.084c-0.195,0.195-0.157,0.551,0.085,0.791 c0.241,0.242,0.596,0.281,0.791,0.086l2.546-2.545l2.545,2.543C6.285,7.154,6.638,7.117,6.88,6.875 C7.123,6.635,7.16,6.279,6.964,6.084z" />
    </svg>
  </div>
);

CloseIcon.propTypes = {
  backgroundColor: React.PropTypes.string,
};

export default CloseIcon;
