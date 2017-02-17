import React from 'react';
import FontIcon from 'material-ui/FontIcon';

const LEVEL_INFO = 'info';
const LEVEL_WARNING = 'warning';
const LEVEL_ERROR = 'error';

function composeNotice(level) {
  const fontIconName = level;
  const Notice = props => (
    <div className={`notice ${level}-notice`}>
      <FontIcon className="material-icons" color={'#000000'}>{fontIconName}</FontIcon>
      {props.children}
    </div>
  );
  Notice.propTypes = {
    children: React.PropTypes.node.isRequired,
  };
  return Notice;
}

export const InfoNotice = composeNotice(LEVEL_INFO);

export const WarningNotice = composeNotice(LEVEL_WARNING);

export const ErrorNotice = composeNotice(LEVEL_ERROR);
