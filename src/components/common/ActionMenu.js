import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import Menu from '@material-ui/core/Menu';
import Popover from '@material-ui/core/Popover';
import { MoreOptionsButton, CloseButton } from './IconButton';
import { getBrandDarkColor, getBrandDarkerColor } from '../../styles/colors';
// import AppButton from './AppButton';

class ActionMenu extends React.Component {
  state = {
    backgroundColor: getBrandDarkColor(),
    anchorEl: null,
  };

  handlePopupOpenClick = (event) => {
    if (event) {
      this.handlePopupOpen(event);
    } else {
      this.handlePopupClose(event);
    }
  }
  handlePopupOpen = (event) => {
    event.preventDefault(); // don't go anywhere on anchor click
    this.setState({ anchorEl: event.currentTarget });
  }
  handlePopupClose = () => {
    this.setState({ anchorEl: null });
  }
  handleMouseEnter = () => {
    this.setState({ backgroundColor: getBrandDarkerColor() });
  }
  handleMouseLeave = () => {
    this.setState({ backgroundColor: getBrandDarkColor() });
  }

  render() {
    const { color, openButton, closeButton, children, actionTextMsg } = this.props;
    const { anchorEl } = this.state;
    const { formatMessage } = this.props.intl;
    const otherProps = {};
    otherProps.backgroundColor = this.state.backgroundColor;
    let closeIconButton = (
      <CloseButton onClick={this.handlePopupClose} color={color} {...otherProps} aria-controls="action-menu" />
    );
    let openIconButton = (
      <MoreOptionsButton onClick={this.handlePopupOpenClick} color={color} {...otherProps} aria-haspopup="true" aria-owns="action-menu" aria-controls="action-menu" />
    );

    if (openButton) {
      openIconButton = open;
    }
    if (closeButton) {
      closeIconButton = close;
    }

    const icon = (this.state.anchorEl) ? closeIconButton : openIconButton;

    // support text or icon-driven menus
    let menuContent;
    if (actionTextMsg) {
      menuContent = (
        <span>
          <a className="text-trigger" role="button" href={`#${formatMessage(actionTextMsg)}`} onClick={this.handlePopupOpen}>
            <FormattedMessage {...actionTextMsg} />
          </a>
          <Popover
            open={Boolean(anchorEl)}
            anchorEl={this.state.anchorEl}
            onClick={this.handlePopupOpen}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
          >
            {children}
          </Popover>
        </span>
      );
    } else {
      menuContent = (
        <span>
          {icon}
          <Menu
            id="action-menu"
            anchorEl={this.state.anchorEl}
            open={Boolean(anchorEl)}
            onClose={this.handlePopupClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            getContentAnchorEl={null}
          >
            {children}
          </Menu>
        </span>
      );
    }

    return (
      <div className="action-icon-menu">
        {menuContent}
      </div>
    );
  }
}
ActionMenu.propTypes = {
  onClick: PropTypes.func,
  topLevelButton: PropTypes.func,
  children: PropTypes.array,
  openButton: PropTypes.object,
  closeButton: PropTypes.object,
  tooltip: PropTypes.string,
  intl: PropTypes.object.isRequired,
  color: PropTypes.string,
  iconStyle: PropTypes.object,
  actionTextMsg: PropTypes.object,
};

export default injectIntl(ActionMenu);
