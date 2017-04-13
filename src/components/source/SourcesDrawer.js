import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import messages from '../../resources/messages';
import Permissioned from '../common/Permissioned';
import { PERMISSION_MEDIA_EDIT } from '../../lib/auth';

const localMessages = {
  menuTitle: { id: 'sources.menu.title', defaultMessage: 'Source Manager' },
  home: { id: 'sources.menu.items.home', defaultMessage: 'Home' },
  mc: { id: 'sources.menu.items.mc', defaultMessage: 'Collections: Media Cloud' },
  gv: { id: 'sources.menu.items.gv', defaultMessage: 'Collections: Global Voices' },
  emm: { id: 'sources.menu.items.emm', defaultMessage: 'Collections: European Media Monitor' },
  newCollection: { id: 'sources.menu.items.newCollection', defaultMessage: 'Create a Collection' },
  newSource: { id: 'sources.menu.items.newSource', defaultMessage: 'Add a Source' },
  favoritedItems: { id: 'sources.menu.items.favoritedItems', defaultMessage: 'My Starred Sources And Collections' },
  suggestSource: { id: 'sources.menu.items.suggestSource', defaultMessage: 'Suggest a Source' },
  pendingSuggestions: { id: 'sources.menu.items.pendingSuggestions', defaultMessage: 'Pending Suggestions' },
};

class SourcesDrawer extends React.Component {

  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  handleToggle = () => { this.setState({ open: !this.state.open }); };

  close = () => this.setState({ open: false });

  render() {
    const { user, handleMenuItemClick } = this.props;
    const { formatMessage } = this.props.intl;
    // gotta show extra login invivation based on the user state
    let logoutMenuItem = null;
    if (!user.isLoggedIn) {
      logoutMenuItem = (
        <MenuItem onTouchTap={() => { this.close(); handleMenuItemClick('/login'); }}>
          <FormattedMessage {...messages.userLogin} />
        </MenuItem>
      );
    }

    // only show app actions if they are logged in
    let appMenuItems = null;
    if (user.isLoggedIn) {
      appMenuItems = (
        <div>
          <MenuItem onTouchTap={() => { this.close(); handleMenuItemClick('/home'); }}>
            <FormattedMessage {...localMessages.home} />
          </MenuItem>
          <MenuItem onTouchTap={() => { this.close(); handleMenuItemClick('/search'); }}>
            <FormattedMessage {...messages.search} />
          </MenuItem>
          <Divider />
          <MenuItem id="media-cloud-collections" onTouchTap={() => { this.close(); handleMenuItemClick('/collections/media-cloud'); }}>
            <FormattedMessage {...localMessages.mc} />
          </MenuItem>
          <MenuItem id="global-voices-collections" onTouchTap={() => { this.close(); handleMenuItemClick('/collections/global-voices'); }}>
            <FormattedMessage {...localMessages.gv} />
          </MenuItem>
          <MenuItem id="european-media-monitor-collections" onTouchTap={() => { this.close(); handleMenuItemClick('/collections/european-media-monitor'); }}>
            <FormattedMessage {...localMessages.emm} />
          </MenuItem>
          <Divider />
          <MenuItem onTouchTap={() => { this.close(); handleMenuItemClick('/favorites'); }}>
            <FormattedMessage {...localMessages.favoritedItems} />
          </MenuItem>
          <MenuItem onTouchTap={() => { this.close(); handleMenuItemClick('/sources/suggest'); }}>
            <FormattedMessage {...localMessages.suggestSource} />
          </MenuItem>
          <Permissioned onlyRole={PERMISSION_MEDIA_EDIT}>
            <MenuItem onTouchTap={() => { this.close(); handleMenuItemClick('/sources/suggestions'); }}>
              <FormattedMessage {...localMessages.pendingSuggestions} />
            </MenuItem>
            <Divider />
            <MenuItem onTouchTap={() => { this.close(); handleMenuItemClick('/sources/create'); }}>
              <FormattedMessage {...localMessages.newSource} />
            </MenuItem>
            <MenuItem onTouchTap={() => { this.close(); handleMenuItemClick('/collections/create'); }}>
              <FormattedMessage {...localMessages.newCollection} />
            </MenuItem>
          </Permissioned>
        </div>
      );
    }
    // bring it all together in a controlled drawer
    return (
      <div className="drawer sources-drawer">
        <IconButton
          id="sources-drawer-button"
          iconClassName="material-icons"
          tooltip={formatMessage(messages.menuOpenTooltip)}
          onTouchTap={this.handleToggle}
          style={{ padding: 8, height: 40, width: 40 }}
        >
          menu
        </IconButton>
        <Drawer
          width={300}
          openSecondary
          docked={false}
          open={this.state.open}
          onRequestChange={open => this.setState({ open })}
        >
          <AppBar title={formatMessage(localMessages.menuTitle)} showMenuIconButton={false} />
          {appMenuItems}
          <Divider />
          <MenuItem onTouchTap={() => { this.close(); handleMenuItemClick('/about'); }}>
            <FormattedMessage {...messages.menuAbout} />
          </MenuItem>
          {logoutMenuItem}
        </Drawer>
      </div>
    );
  }
}

SourcesDrawer.propTypes = {
  // state
  user: React.PropTypes.object.isRequired,
  // from dispatch
  handleMenuItemClick: React.PropTypes.func.isRequired,
  // from context
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  handleMenuItemClick: (path) => {
    dispatch(push(path));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      SourcesDrawer
    )
  );
