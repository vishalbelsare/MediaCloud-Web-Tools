import PropTypes from 'prop-types';
import React from 'react';
import Icon from '@material-ui/core/Icon';
import Link from 'react-router/lib/Link';
import { getBrandDarkColor } from '../../styles/colors';

const DeleteButton = props => (
  <Link to="#" onClick={props.onClick} name={props.tooltip}>
    <Icon className="material-icons" color={getBrandDarkColor()}>delete</Icon>
  </Link>
);

DeleteButton.propTypes = {
  tooltip: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default DeleteButton;
