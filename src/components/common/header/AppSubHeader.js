import React from 'react';
import FavoriteToggler from '../FavoriteToggler';
import { PERMISSION_LOGGED_IN } from '../../../lib/auth';
import Permissioned from '../../common/Permissioned';

const AppSubHeader = (props) => {
  const { title, isFavorite, onSetFavorited, subTitle } = props;
  return (
    <div className="app-sub-header" >
      <h1>
        {title}
        <Permissioned onlyRole={PERMISSION_LOGGED_IN}>
          <FavoriteToggler
            isFavorited={isFavorite}
            onSetFavorited={isFavNow => onSetFavorited(isFavNow)}
          />
        </Permissioned>
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
