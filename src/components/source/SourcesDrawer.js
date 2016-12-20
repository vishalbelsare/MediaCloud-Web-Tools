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
  profile: { id: 'sources.menu.items.profile', defaultMessage: 'Profile' },
  newCollection: { id: 'sources.menu.items.newCollection', defaultMessage: 'Create a Collection' },
  newSource: { id: 'sources.menu.items.newSource', defaultMessage: 'Add a Source' },
};

class SourcesDrawer extends React.Component {

  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  handleToggle = () => this.setState({ open: !this.state.open });

  close = () => this.setState({ open: false });

  render() {
    const { user, handleMenuItemClick } = this.props;
    const { formatMessage } = this.props.intl;
    // gotta show login or logout correctly based on the user state
    let loginLogoutMenuItem = null;
    if (user.isLoggedIn) {
      loginLogoutMenuItem = (
        <MenuItem onTouchTap={() => { this.close(); handleMenuItemClick('/logout'); }}>
          <FormattedMessage {...messages.userLogout} />
        </MenuItem>
      );
    } else {
      loginLogoutMenuItem = (
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
          <Divider />
          <MenuItem onTouchTap={() => { this.close(); handleMenuItemClick('/collections/media-cloud'); }}>
            <FormattedMessage {...localMessages.mc} />
          </MenuItem>
          <MenuItem onTouchTap={() => { this.close(); handleMenuItemClick('/collections/global-voices'); }}>
            <FormattedMessage {...localMessages.gv} />
          </MenuItem>
          <MenuItem onTouchTap={() => { this.close(); handleMenuItemClick('/collections/european-media-monitor'); }}>
            <FormattedMessage {...localMessages.emm} />
          </MenuItem>
          <Divider />
          <Permissioned onlyRole={PERMISSION_MEDIA_EDIT}>
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
      <div>
        <IconButton
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
          <MenuItem onTouchTap={() => { this.close(); handleMenuItemClick('/user/profile'); }}>
            <FormattedMessage {...localMessages.profile} />
          </MenuItem>
          {loginLogoutMenuItem}
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
