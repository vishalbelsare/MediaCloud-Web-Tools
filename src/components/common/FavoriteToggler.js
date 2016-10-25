import React from 'react';
import { injectIntl } from 'react-intl';
import { FavoriteButton, FavoriteBorderButton } from './IconButton';
import messages from '../../resources/messages';

const FavoriteToggler = (props) => {
  const { isFavorited, onChangeFavorited } = props;
  const { formatMessage } = props.intl;
  let mainButton = null;
  if (isFavorited) {
    mainButton = (<FavoriteButton
      tooltip={formatMessage(messages.unfavorite)}
      onClick={() => onChangeFavorited(false)}
    />);
  } else {
    mainButton = (<FavoriteBorderButton
      tooltip={formatMessage(messages.favorite)}
      onClick={() => onChangeFavorited(true)}
    />);
  }
  return (
    <div className="fav-toggle-button">
      { mainButton }
    </div>
  );
};

FavoriteToggler.propTypes = {
  intl: React.PropTypes.object.isRequired,
  isFavorited: React.PropTypes.bool.isRequired,
  onChangeFavorited: React.PropTypes.func.isRequired,
};

export default injectIntl(FavoriteToggler);
