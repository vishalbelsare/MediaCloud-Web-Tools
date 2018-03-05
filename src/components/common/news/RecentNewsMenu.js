import PropTypes from 'prop-types';
import React from 'react';
import Popover from 'material-ui/Popover';
import { FormattedMessage, injectIntl } from 'react-intl';
import { NotificationsButton } from '../IconButton';
import messages from '../../../resources/messages';
import RecentNewsMenuItem from './RecentNewsMenuItem';

class RecentNewsMenu extends React.Component {

  state = {
    open: false,
    anchorEl: null,
  };

  handleToggle = (event) => {
    // This prevents ghost click.
    event.preventDefault();
    this.setState({
      open: !this.state.open,
      anchorEl: event.currentTarget,
    });
  }

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  render() {
    const { newsItems } = this.props;
    return (
      <div className="recent-news-menu">
        <NotificationsButton onClick={this.handleToggle} color={'#FFFFFF'} />
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'right', vertical: 'top' }}
          onRequestClose={this.handleRequestClose}
        >
          <div className="recent-news-menu-content">
            <h3> <FormattedMessage {...messages.recentNews} /></h3>
            <div className="recent-news-menu-items">
              {newsItems.map(item => <RecentNewsMenuItem item={item} />)}
            </div>
          </div>
        </Popover>
      </div>
    );
  }

}

RecentNewsMenu.propTypes = {
  // from parent
  newsItems: PropTypes.array,
};

export default
  injectIntl(
    RecentNewsMenu
  );
