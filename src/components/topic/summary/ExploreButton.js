import React from 'react';
import IconButton from 'material-ui/IconButton';
import LinkWithFilters from '../LinkWithFilters';

const ExploreButton = (props) => {
  const { tooltip, to, style } = props;
  return (
    <LinkWithFilters to={to} style={style}>
      <IconButton iconClassName="material-icons" tooltip={tooltip}>
        subdirectory_arrow_right
      </IconButton>
    </LinkWithFilters>
  );
};

ExploreButton.propTypes = {
  tooltip: React.PropTypes.string.isRequired,
  to: React.PropTypes.string.isRequired,
  style: React.PropTypes.object,
};

export default ExploreButton;
