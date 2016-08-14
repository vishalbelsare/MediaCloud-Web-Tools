import React from 'react';
import FontIcon from 'material-ui/FontIcon';
import { getBrandDarkColor } from '../../styles/colors';
import Link from 'react-router/lib/Link';

const DeleteButton = (props) => (
  <Link to="#" onClick={props.onClick} name={props.tooltip}>
    <FontIcon className="material-icons" color={getBrandDarkColor()}>delete</FontIcon>
  </Link>
);

DeleteButton.propTypes = {
  tooltip: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func.isRequired,
};

export default DeleteButton;
