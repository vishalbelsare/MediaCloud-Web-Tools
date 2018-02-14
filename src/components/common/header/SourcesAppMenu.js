import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import messages from '../../../resources/messages';
import AppMenu from '../../common/header/AppMenu';
import { urlToSourceManager } from '../../../lib/urlUtil';
import { getAppName } from '../../../config';
import { getUserRoles, hasPermissions, PERMISSION_MEDIA_EDIT } from '../../../lib/auth';

const localMessages = {
  menuTitle: { id: 'sources.menu.title', defaultMessage: 'Sources' },
  home: { id: 'sources.menu.items.home', defaultMessage: 'Sources Home' },
  newCollection: { id: 'sources.menu.items.newCollection', defaultMessage: 'Create a Collection' },
  newSource: { id: 'sources.menu.items.newSource', defaultMessage: 'Add a Source' },
  favoritedItems: { id: 'sources.menu.items.favoritedItems', defaultMessage: 'My Starred Sources And Collections' },
  suggestSource: { id: 'sources.menu.items.suggestSource', defaultMessage: 'Suggest a Source' },
  pendingSuggestions: { id: 'sources.menu.items.pendingSuggestions', defaultMessage: 'Pending Suggestions' },
};


const SourcesAppMenu = (props) => {
  let menu;
  if (props.isLoggedIn && hasPermissions(getUserRoles(props.user), PERMISSION_MEDIA_EDIT)) {
    menu = (
      <Menu>
        <MenuItem onClick={() => { props.handleItemClick('home', true); }}>
          <FormattedMessage {...messages.home} />
        </MenuItem>
        <MenuItem onClick={() => { props.handleItemClick('search', true); }}>
          <FormattedMessage {...messages.search} />
        </MenuItem>
        <MenuItem onClick={() => { props.handleItemClick('favorites', true); }}>
          <FormattedMessage {...localMessages.favoritedItems} />
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { props.handleItemClick('sources/suggest', true); }}>
          <FormattedMessage {...localMessages.suggestSource} />
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { props.handleItemClick('sources/suggestions', true); }}>
          <FormattedMessage {...localMessages.pendingSuggestions} />
        </MenuItem>
        <MenuItem onClick={() => { props.handleItemClick('sources/create', true); }}>
          <FormattedMessage {...localMessages.newSource} />
        </MenuItem>
        <MenuItem onClick={() => { props.handleItemClick('collections/create', true); }}>
          <FormattedMessage {...localMessages.newCollection} />
        </MenuItem>
      </Menu>
    );
  } else if (props.isLoggedIn) {
    menu = (
      <Menu>
        <MenuItem onClick={() => { props.handleItemClick('home', true); }}>
          <FormattedMessage {...messages.home} />
        </MenuItem>
        <MenuItem onClick={() => { props.handleItemClick('search', true); }}>
          <FormattedMessage {...messages.search} />
        </MenuItem>
        <MenuItem onClick={() => { props.handleItemClick('favorites', true); }}>
          <FormattedMessage {...localMessages.favoritedItems} />
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { props.handleItemClick('sources/suggest', true); }}>
          <FormattedMessage {...localMessages.suggestSource} />
        </MenuItem>
      </Menu>
    );
  }
  return (
    <AppMenu
      titleMsg={localMessages.menuTitle}
      showMenu={getAppName() === 'sources' && props.isLoggedIn}
      onTitleClick={() => { props.handleItemClick('about', getAppName() === 'sources'); }}
      menuComponent={menu}
    />
  );
};

SourcesAppMenu.propTypes = {
  // state
  isLoggedIn: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  // from dispatch
  handleItemClick: PropTypes.func.isRequired,
  // from context
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  isLoggedIn: state.user.isLoggedIn,
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  handleItemClick: (path, isLocal) => {
    if (isLocal) {
      dispatch(push(path));
    } else {
      window.location.href = urlToSourceManager(path);
    }
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      SourcesAppMenu
    )
  );
