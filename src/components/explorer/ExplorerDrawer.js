import PropTypes from 'prop-types';
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

const localMessages = {
  menuTitle: { id: 'sources.menu.title', defaultMessage: 'Explorer' },
  home: { id: 'sources.menu.items.home', defaultMessage: 'Home' },
};

class ExplorerDrawer extends React.Component {

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
    let loginMenuItem = null;
    if (!user.isLoggedIn) {
      loginMenuItem = (
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
          {loginMenuItem}
        </Drawer>
      </div>
    );
  }
}

ExplorerDrawer.propTypes = {
  // state
  user: PropTypes.object.isRequired,
  // from dispatch
  handleMenuItemClick: PropTypes.func.isRequired,
  // from context
  intl: PropTypes.object.isRequired,
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
      ExplorerDrawer
    )
  );
