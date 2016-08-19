import React from 'react';
import FontIcon from 'material-ui/FontIcon';
import Link from 'react-router/lib/Link';
import { getBrandDarkColor } from '../../styles/colors';

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
