import PropTypes from 'prop-types';
import React from 'react';
import Link from 'react-router/lib/Link';
import FavoriteToggler from '../FavoriteToggler';
import { PERMISSION_LOGGED_IN } from '../../../lib/auth';
import Permissioned from '../../common/Permissioned';

const AppSubHeader = (props) => {
  const { link, title, isFavorite, onSetFavorited, subTitle } = props;
  let titleContent;
  if (link) {
    titleContent = (<Link to={link}>{title}</Link>);
  } else {
    titleContent = title;
  }
  return (
    <div className="app-sub-header" >
      <h1>
        {titleContent}
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
  title: PropTypes.string.isRequired,
  isFavorite: PropTypes.bool,
  onSetFavorited: PropTypes.func,
  subTitle: PropTypes.string,
  link: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
};

export default AppSubHeader;
