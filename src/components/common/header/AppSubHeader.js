import React from 'react';
import FavoriteToggler from '../FavoriteToggler';

const AppSubHeader = (props) => {
  const { title, isFavorite, onSetFavorited, subTitle } = props;
  return (
    <div className="app-sub-header" >
      <h1>
        {title}
        <FavoriteToggler
          isFavorited={isFavorite}
          onSetFavorited={isFavNow => onSetFavorited(isFavNow)}
        />
      </h1>
      <p className="sub-title">{subTitle}</p>
    </div>
  );
};

AppSubHeader.propTypes = {
  // from parent
  title: React.PropTypes.string.isRequired,
  isFavorite: React.PropTypes.bool,
  onSetFavorited: React.PropTypes.func,
  subTitle: React.PropTypes.string,
};

export default AppSubHeader;
