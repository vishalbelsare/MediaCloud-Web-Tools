import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
// import { push } from 'react-router-redux';
import FlatButton from 'material-ui/FlatButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import messages from '../../../resources/messages';
import { urlToExplorer } from '../../../lib/urlUtil';

const localMessages = {
  menuTitle: { id: 'explorer.menu.title', defaultMessage: 'Explorer' },
  home: { id: 'explorer.menu.items.home', defaultMessage: 'Explorer Home' },
  listTopics: { id: 'explorer.menu.items.listTopics', defaultMessage: 'Explorer' },
};


class ExplorerAppMenu extends React.Component {

  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  handleToggle = (event) => { this.setState({ open: !this.state.open, anchorEl: event.currentTarget }); };

  close = () => this.setState({ open: false });

  render() {
    const { user, sendToExplorer } = this.props;
    const { formatMessage } = this.props.intl;
    // only show app actions if they are logged in
    let appMenuItems = null;
    if (user.isLoggedIn) {
      appMenuItems = (
        <Menu>
          <MenuItem onTouchTap={() => { this.close(); sendToExplorer('home'); }}>
            <FormattedMessage {...localMessages.home} />
          </MenuItem>
          <Divider />
        </Menu>
      );
    }
    const aboutItem = (
      <MenuItem onTouchTap={() => { this.close(); sendToExplorer('about'); }}>
        <FormattedMessage {...messages.menuAbout} />
      </MenuItem>
    );


    return (
      <div className="explorer-app-menu">
        <FlatButton
          onClick={this.handleToggle}
          label={formatMessage(localMessages.menuTitle)}
        />
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          // anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          // targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.close}
        >
          {appMenuItems}
          {aboutItem}
        </Popover>
      </div>
    );
  }
}

ExplorerAppMenu.propTypes = {
  // state
  user: PropTypes.object.isRequired,
  // from dispatch
  sendToExplorer: PropTypes.func.isRequired,
  // from context
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = () => ({
  sendToExplorer: (path) => {
    window.open(urlToExplorer(path));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      ExplorerAppMenu
    )
  );
