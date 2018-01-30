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
import { PERMISSION_MEDIA_EDIT } from '../../../lib/auth';
import { urlToSource, urlToCollection } from '../../../lib/urlUtil';

const localMessages = {
  menuTitle: { id: 'sources.menu.title', defaultMessage: 'Sources' },
  home: { id: 'sources.menu.items.home', defaultMessage: 'Sources Home' },
  /* mc: { id: 'sources.menu.items.mc', defaultMessage: 'Collections: Media Cloud' },
  gv: { id: 'sources.menu.items.gv', defaultMessage: 'Collections: Global Voices' },
  emm: { id: 'sources.menu.items.emm', defaultMessage: 'Collections: European Media Monitor' },
  country: { id: 'sources.menu.items.country', defaultMessage: 'Collections: Country & State' },
  */
  newCollection: { id: 'sources.menu.items.newCollection', defaultMessage: 'Create a Collection' },
  newSource: { id: 'sources.menu.items.newSource', defaultMessage: 'Add a Source' },
  favoritedItems: { id: 'sources.menu.items.favoritedItems', defaultMessage: 'My Starred Sources And Collections' },
  suggestSource: { id: 'sources.menu.items.suggestSource', defaultMessage: 'Suggest a Source' },
  pendingSuggestions: { id: 'sources.menu.items.pendingSuggestions', defaultMessage: 'Pending Suggestions' },
};


class SourcesAppMenu extends React.Component {

  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  handleToggle = (event) => { this.setState({ open: !this.state.open, anchorEl: event.currentTarget }); };

  close = () => this.setState({ open: false });

  render() {
    const { user, sendToSources, sendToCollections } = this.props;
    const { formatMessage } = this.props.intl;
    // only show app actions if they are logged in
    let appMenuItems = null;
    if (user.isLoggedIn) {
      appMenuItems = (
        <Menu>
          <MenuItem onTouchTap={() => { this.close(); sendToSources('home'); }}>
            <FormattedMessage {...messages.home} />
          </MenuItem>
          <MenuItem onTouchTap={() => { this.close(); sendToSources('search'); }}>
            <FormattedMessage {...messages.search} />
          </MenuItem>
          <Divider />
          <MenuItem onTouchTap={() => { this.close(); sendToSources('favorites'); }}>
            <FormattedMessage {...localMessages.favoritedItems} />
          </MenuItem>
          <MenuItem onTouchTap={() => { this.close(); sendToSources('suggest'); }}>
            <FormattedMessage {...localMessages.suggestSource} />
          </MenuItem>
          <Permissioned onlyRole={PERMISSION_MEDIA_EDIT}>
            <MenuItem onTouchTap={() => { this.close(); sendToSources('suggestions'); }}>
              <FormattedMessage {...localMessages.pendingSuggestions} />
            </MenuItem>
            <Divider />
            <MenuItem onTouchTap={() => { this.close(); sendToSources('create'); }}>
              <FormattedMessage {...localMessages.newSource} />
            </MenuItem>
            <MenuItem onTouchTap={() => { this.close(); sendToCollections('create'); }}>
              <FormattedMessage {...localMessages.newCollection} />
            </MenuItem>
          </Permissioned>
          <Divider />
        </Menu>
      );
    }
    const aboutItem = (
      <MenuItem onTouchTap={() => { this.close(); sendToSources('about'); }}>
        <FormattedMessage {...messages.menuAbout} />
      </MenuItem>
    );


    return (
      <div className="sources-app-menu">
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

SourcesAppMenu.propTypes = {
  // state
  user: PropTypes.object.isRequired,
  // from dispatch
  sendToSources: PropTypes.func.isRequired,
  sendToCollections: PropTypes.func.isRequired,
  // from context
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = () => ({
  sendToSources: (path) => {
    window.location.href = urlToSource(path);
  },
  sendToCollections: (path) => {
    window.location.href = urlToCollection(path);
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      SourcesAppMenu
    )
  );
