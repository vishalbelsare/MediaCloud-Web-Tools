import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import messages from '../../../resources/messages';
import Permissioned from '../../common/Permissioned';
import AppMenu from '../../common/header/AppMenu';
import { PERMISSION_ADMIN } from '../../../lib/auth';
import { urlToTopicMapper } from '../../../lib/urlUtil';
import { getAppName } from '../../../config';

const localMessages = {
  menuTitle: { id: 'topics.menu.title', defaultMessage: 'Topics' },
  home: { id: 'topics.menu.items.home', defaultMessage: 'Home' },
  listTopics: { id: 'topics.menu.items.listTopics', defaultMessage: 'Admin: Topic Status Dashboard' },
};


const TopicsAppMenu = (props) => {
  let menu;
  if (props.isLoggedIn) {
    menu = (
      <Menu>
        <MenuItem onTouchTap={() => { props.handleItemClick('home'); }}>
          <FormattedMessage {...localMessages.home} />
        </MenuItem>
        <MenuItem onTouchTap={() => { props.handleItemClick('topics/create'); }}>
          <FormattedMessage {...messages.createNewTopic} />
        </MenuItem>
        <Permissioned onlyRole={PERMISSION_ADMIN}>
          <MenuItem onTouchTap={() => { props.handleItemClick('topics/status'); }}>
            <FormattedMessage {...localMessages.listTopics} />
          </MenuItem>
        </Permissioned>
      </Menu>
    );
  }
  return (
    <AppMenu
      titleMsg={localMessages.menuTitle}
      showMenu={getAppName() === 'topics'}
      onTitleClick={() => { props.handleItemClick('about', props.isLoggedIn); }}
    >
      {menu}
    </AppMenu>
  );
};

TopicsAppMenu.propTypes = {
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
      dispatch(push(urlToTopicMapper(path)));
    } else {
      window.location.href = urlToTopicMapper(path);
    }
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      TopicsAppMenu
    )
  );
