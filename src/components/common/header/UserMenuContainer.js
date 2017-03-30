import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import IconMenu from 'material-ui/IconMenu';
import PersonIcon from 'material-ui/svg-icons/social/person';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import { PERMISSION_LOGGED_IN } from '../../../lib/auth';
import Permissioned from '../Permissioned';
import messages from '../../../resources/messages';

/**
 * A permissioned menu of user-related activities, for display on a nav bar or something.
 **/
const UserMenuContainer = (props) => {
  const { user, routeToUrl } = props;
  // gotta show login or logout correctly based on the user state
  let loginLogoutMenuItem = null;
  if (user.isLoggedIn) {
    loginLogoutMenuItem = (
      <Permissioned onlyRole={PERMISSION_LOGGED_IN}>
        <IconMenu
          iconButtonElement={<IconButton><PersonIcon /></IconButton>}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'right', vertical: 'top' }}
        >
          <MenuItem onTouchTap={() => { routeToUrl('/user/profile'); }}>
            <FormattedMessage {...messages.userProfile} />
          </MenuItem>
          <MenuItem onTouchTap={() => { routeToUrl('/user/change-password'); }}>
            <FormattedMessage {...messages.userChangePassword} />
          </MenuItem>
          <MenuItem onTouchTap={() => { routeToUrl('/logout'); }}>
            <FormattedMessage {...messages.userLogout} />
          </MenuItem>
        </IconMenu>
      </Permissioned>
    );
  }
  return (
    <div className="user-menu">
      {loginLogoutMenuItem}
    </div>
  );
};

UserMenuContainer.propTypes = {
  // from state
  user: React.PropTypes.object.isRequired,
  // from dispatch
  routeToUrl: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  userTopicPermission: state.topics.selected.info.user_permission,
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  routeToUrl: (url) => {
    dispatch(push(url));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      UserMenuContainer
    )
  );
