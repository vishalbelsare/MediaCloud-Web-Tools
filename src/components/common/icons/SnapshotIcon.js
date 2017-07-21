import PropTypes from 'prop-types';
import React from 'react';

const DEFAULT_WIDTH = 69.331;
const DEFAULT_HEIGHT = 51.317;
const SCALE = DEFAULT_WIDTH / DEFAULT_HEIGHT;

const SnapshotIcon = (props) => {
  const height = props.height || DEFAULT_HEIGHT;
  const width = height * SCALE;
  return (
    <div className="app-icon app-icon-large app-icon-snapshot">
      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width={`${width}px`} height={`${height}px`} viewBox="0 0 69.331 51.317" enableBackground="new 0 0 69.331 51.317" xmlSpace="preserve">
        <g>
          <path d="M36.09,10.572c-9.732,0-17.65,7.918-17.65,17.65c0,9.731,7.918,17.649,17.65,17.649c9.731,0,17.649-7.918,17.649-17.649 C53.739,18.49,45.821,10.572,36.09,10.572z M36.09,42.872c-8.078,0-14.65-6.571-14.65-14.649s6.572-14.65,14.65-14.65 s14.649,6.572,14.649,14.65S44.168,42.872,36.09,42.872z" />
          <path d="M36.09,19.128c-5.015,0-9.094,4.079-9.094,9.094s4.079,9.094,9.094,9.094c5.014,0,9.093-4.079,9.093-9.094 S41.104,19.128,36.09,19.128z M36.09,34.316c-3.36,0-6.094-2.733-6.094-6.094s2.733-6.094,6.094-6.094 c3.359,0,6.093,2.733,6.093,6.094S39.449,34.316,36.09,34.316z" />
          <path d="M64.034,5.128h-40.7C23.243,2.287,20.918,0,18.055,0h-7.537c-2.865,0-5.192,2.29-5.28,5.134C2.344,5.167,0,7.524,0,10.425 V46.02c0,2.921,2.376,5.297,5.297,5.297h58.737c2.921,0,5.297-2.376,5.297-5.297V10.425C69.331,7.504,66.955,5.128,64.034,5.128z  M10.518,3h7.537c1.21,0,2.204,0.94,2.291,2.128H8.227C8.313,3.94,9.308,3,10.518,3z M66.331,46.02c0,1.267-1.03,2.297-2.297,2.297 H5.297C4.03,48.317,3,47.287,3,46.02V10.425c0-1.267,1.03-2.297,2.297-2.297h0.396h17.186h41.156c1.267,0,2.297,1.03,2.297,2.297 V46.02z" />
        </g>
      </svg>
    </div>
  );
};

SnapshotIcon.propTypes = {
  height: PropTypes.number,
};

export default SnapshotIcon;
