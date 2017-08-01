import React from 'react';

const MoreOptionsIcon = props => (
  <div className="app-icon app-icon-more-options" style={{ backgroundColor: props.backgroundColor }}>
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="10.322px" height="6.6px" viewBox="0 0 10.322 2.203" enableBackground="new 0 0 10.322 2.203" xmlSpace="preserve">
      <g>
        <g>
          <path fill="#FFFFFF" d="M0,1.091C0,0.465,0.525,0,1.092,0c0.586,0,1.091,0.465,1.091,1.091c0,0.627-0.505,1.112-1.091,1.112 C0.525,2.203,0,1.718,0,1.091z" />
          <path fill="#FFFFFF" d="M4.08,1.091C4.08,0.465,4.606,0,5.172,0c0.585,0,1.09,0.465,1.09,1.091c0,0.627-0.504,1.112-1.09,1.112 C4.606,2.203,4.08,1.718,4.08,1.091z" />
          <path fill="#FFFFFF" d="M8.16,1.091C8.16,0.465,8.686,0,9.252,0c0.586,0,1.089,0.465,1.089,1.091c0,0.627-0.503,1.112-1.089,1.112 C8.686,2.203,8.16,1.718,8.16,1.091z" />
        </g>
      </g>
    </svg>
  </div>
);

MoreOptionsIcon.propTypes = {
  backgroundColor: React.PropTypes.string,
};

export default MoreOptionsIcon;
