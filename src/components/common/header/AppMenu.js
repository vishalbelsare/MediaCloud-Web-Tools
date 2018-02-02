import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import FlatButton from 'material-ui/FlatButton';
import Popover from 'material-ui/Popover';

class AppMenu extends React.Component {

  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  toggleMenu = (event) => { this.setState({ open: !this.state.open, anchorEl: event.currentTarget }); };

  close = () => this.setState({ open: false });

  render() {
    const { titleMsg, showMenu, onTitleClick, children } = this.props;
    const { formatMessage } = this.props.intl;
    let titleButtonClickHandler;
    if (showMenu) {
      titleButtonClickHandler = this.toggleMenu;
    } else {
      titleButtonClickHandler = event => onTitleClick(event);
    }
    return (
      <div className="app-menu">
        <FlatButton onClick={titleButtonClickHandler} label={formatMessage(titleMsg)} />
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          onRequestClose={this.close}
        >
          {children}
        </Popover>
      </div>
    );
  }
}

AppMenu.propTypes = {
  // parent
  titleMsg: PropTypes.object.isRequired,
  showMenu: PropTypes.bool,
  onTitleClick: PropTypes.func.isRequired,
  // from dispatch
  children: PropTypes.node,
  // from context
  intl: PropTypes.object.isRequired,
};

export default
  injectIntl(
    AppMenu
  );
