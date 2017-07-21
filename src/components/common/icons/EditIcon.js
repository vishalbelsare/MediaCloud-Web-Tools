import PropTypes from 'prop-types';
import React from 'react';

const EditIcon = props => (
  <div className="app-icon app-icon-edit" style={{ backgroundColor: props.backgroundColor }}>
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="11px" height="11.007px" viewBox="0 0 11 11.007" enableBackground="new 0 0 11 11.007" xmlSpace="preserve">
      <path fill="#FFFFFF" d="M10.841,1.411L9.71,0.28C9.565,0.133,9.405,0.045,9.225,0.012C9.179,0.004,9.138,0,9.105,0 C8.979,0,8.866,0.047,8.779,0.133L7.655,1.264L0.547,8.352C0.527,8.372,0.505,8.43,0.481,8.538l-0.459,2.018 c-0.014,0.039-0.021,0.078-0.021,0.111c0,0.088,0.04,0.174,0.114,0.248c0.059,0.059,0.139,0.092,0.226,0.092 c0.033,0,0.067-0.004,0.1-0.012l1.977-0.52c0.047-0.014,0.119-0.074,0.154-0.107l7.086-7.102l1.131-1.129 c0.141-0.141,0.213-0.281,0.213-0.408C11.001,1.618,10.945,1.514,10.841,1.411z M2.119,9.768L0.82,10.096l0.333-1.299l0.067-0.08 l0.979,0.979L2.119,9.768z M2.717,9.184L1.738,8.198l6.156-6.162l0.984,0.973L2.717,9.184z M9.398,2.502L8.414,1.524l0.752-0.752 l0.979,0.979L9.398,2.502z" />
    </svg>
  </div>
);

EditIcon.propTypes = {
  backgroundColor: PropTypes.string,
};

export default EditIcon;
