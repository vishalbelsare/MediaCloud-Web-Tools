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
import Permissioned from '../../common/Permissioned';
import { PERMISSION_ADMIN } from '../../../lib/auth';
import { urlToTopic } from '../../../lib/urlUtil';

const localMessages = {
  menuTitle: { id: 'topics.menu.title', defaultMessage: 'Topics' },
  home: { id: 'topics.menu.items.home', defaultMessage: 'Topics Home' },
  listTopics: { id: 'topics.menu.items.listTopics', defaultMessage: 'Admin: Topic Status Dashboard' },
};


class TopicsAppMenu extends React.Component {

  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  handleToggle = (event) => { this.setState({ open: !this.state.open, anchorEl: event.currentTarget }); };

  close = () => this.setState({ open: false });

  render() {
    const { user, sendToTopics, sendToTopicHomePage } = this.props;
    const { formatMessage } = this.props.intl;
    // only show app actions if they are logged in
    let appMenuItems = null;
    if (user.isLoggedIn) {
      appMenuItems = (
        <Menu>
          <MenuItem onTouchTap={() => { this.close(); sendToTopicHomePage(); }}>
            <FormattedMessage {...localMessages.home} />
          </MenuItem>
          <MenuItem onTouchTap={() => { this.close(); sendToTopics('create'); }}>
            <FormattedMessage {...messages.createNewTopic} />
          </MenuItem>
          <Permissioned onlyRole={PERMISSION_ADMIN}>
            <MenuItem onTouchTap={() => { this.close(); sendToTopics('status'); }}>
              <FormattedMessage {...localMessages.listTopics} />
            </MenuItem>
          </Permissioned>
          <Divider />
        </Menu>
      );
    }
    const aboutItem = (
      <MenuItem onTouchTap={() => { this.close(); sendToTopics('about'); }}>
        <FormattedMessage {...messages.menuAbout} />
      </MenuItem>
    );


    return (
      <div className="topics-app-menu">
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

TopicsAppMenu.propTypes = {
  // state
  user: PropTypes.object.isRequired,
  // from dispatch
  sendToTopics: PropTypes.func.isRequired,
  sendToTopicHomePage: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
  // from context
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = () => ({
  sendToTopics: (path) => {
    window.open(urlToTopic(path));
  },
  sendToTopicHomePage: () => {
    window.open('https://topics.mediacloud.org/#/home');
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      TopicsAppMenu
    )
  );
