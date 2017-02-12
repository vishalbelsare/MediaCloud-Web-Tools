import React from 'react';

const ResetIcon = props => (
  <div className="app-icon app-icon-medium app-icon-reset" style={{ backgroundColor: props.backgroundColor }}>
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="19.315px" height="21.557px" viewBox="0 0 19.315 21.557" enableBackground="new 0 0 19.315 21.557" xmlSpace="preserve">
      <path fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" d="M18.198,10.902c-0.373,0.099-0.607,0.454-0.646,0.984 c-0.026,0.365-0.037,0.732-0.085,1.095c-0.586,4.386-4.744,7.46-9.105,6.728c-3.585-0.601-6.389-3.571-6.616-7.385 c-0.208-3.495,1.903-6.754,5.31-7.95C7.876,4.085,8.721,3.941,9.627,3.93c0,0.264,0,0.493,0,0.722c0,0.244-0.008,0.488,0.002,0.732 c0.024,0.641,0.513,0.924,1.028,0.557c1.071-0.766,2.128-1.555,3.167-2.363c0.466-0.363,0.445-0.795-0.027-1.154 c-1.014-0.776-2.031-1.549-3.076-2.281c-0.197-0.139-0.564-0.186-0.781-0.096C9.776,0.113,9.664,0.457,9.641,0.689 C9.596,1.16,9.627,1.638,9.627,2.138c-0.533,0.053-1.021,0.074-1.5,0.154C2.725,3.21-0.832,8.317,0.168,13.713 c0.761,4.108,4.301,7.401,8.389,7.8c4.605,0.449,8.654-2.112,10.221-6.469c0.363-1.006,0.525-2.05,0.537-3.115 C19.323,11.173,18.83,10.736,18.198,10.902z"/>
    </svg>
  </div>
);

ResetIcon.propTypes = {
  backgroundColor: React.PropTypes.string,
};

export default ResetIcon;
