import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import AppMenu from '../../common/header/AppMenu';
import { urlToExplorer } from '../../../lib/urlUtil';

const localMessages = {
  menuTitle: { id: 'explorer.menu.title', defaultMessage: 'Explorer' },
};

const ExplorerAppMenu = (props) => {
  let menu;
  return (
    <AppMenu
      titleMsg={localMessages.menuTitle}
      showMenu={false}
      onTitleClick={() => { props.handleItemClick('home', props.isLoggedIn); }}
    >
      {menu}
    </AppMenu>
  );
};

ExplorerAppMenu.propTypes = {
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

const mapDispatchToProps = () => ({
  handleItemClick: (path) => {
    window.location.href = urlToExplorer(path);
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      ExplorerAppMenu
    )
  );
