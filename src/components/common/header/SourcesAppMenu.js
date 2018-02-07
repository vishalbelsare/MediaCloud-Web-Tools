import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import messages from '../../../resources/messages';
import Permissioned from '../../common/Permissioned';
import AppMenu from '../../common/header/AppMenu';
import { PERMISSION_MEDIA_EDIT } from '../../../lib/auth';
import { urlToSourceManager } from '../../../lib/urlUtil';
import { getAppName } from '../../../config';

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
  if (props.isLoggedIn) {
    menu = (
      <Menu>
        <MenuItem onTouchTap={() => { props.handleItemClick('home'); }}>
          <FormattedMessage {...messages.home} />
        </MenuItem>
        <MenuItem onTouchTap={() => { props.handleItemClick('search'); }}>
          <FormattedMessage {...messages.search} />
        </MenuItem>
        <Divider />
        <MenuItem onTouchTap={() => { props.handleItemClick('favorites'); }}>
          <FormattedMessage {...localMessages.favoritedItems} />
        </MenuItem>
        <MenuItem onTouchTap={() => { props.handleItemClick('sources/suggest'); }}>
          <FormattedMessage {...localMessages.suggestSource} />
        </MenuItem>
        <Permissioned onlyRole={PERMISSION_MEDIA_EDIT}>
          <Divider />
          <MenuItem onTouchTap={() => { props.handleItemClick('sources/suggestions'); }}>
            <FormattedMessage {...localMessages.pendingSuggestions} />
          </MenuItem>
          <Divider />
          <MenuItem onTouchTap={() => { props.handleItemClick('sources/create'); }}>
            <FormattedMessage {...localMessages.newSource} />
          </MenuItem>
          <MenuItem onTouchTap={() => { props.handleItemClick('collections/create'); }}>
            <FormattedMessage {...localMessages.newCollection} />
          </MenuItem>
        </Permissioned>
      </Menu>
    );
  }
  return (
    <AppMenu
      titleMsg={localMessages.menuTitle}
      showMenu={getAppName() === 'sources'}
      onTitleClick={() => { props.handleItemClick('about', props.isLoggedIn); }}
    >
      {menu}
    </AppMenu>
  );
};

SourcesAppMenu.propTypes = {
  // state
  isLoggedIn: PropTypes.bool.isRequired,
  // from dispatch
  handleItemClick: PropTypes.func.isRequired,
  // from context
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  isLoggedIn: state.user.isLoggedIn,
});

const mapDispatchToProps = dispatch => ({
  handleItemClick: (path, isLoggedIn = true) => {
    if (isLoggedIn) {
      dispatch(push(urlToSourceManager(path)));
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
