import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';
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
    this.setState({ anchorEl: event.currentTarget.parentElement.parentElement });
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
    const otherProps = {};
    const { anchorEl } = this.state;
    otherProps.backgroundColor = this.state.backgroundColor;
    let closeIconButton = (
      <CloseButton onClick={this.handlePopupClose} color={color} {...otherProps} aria-controls="action-menu" />
    );
    let openIconButton = (
      <MoreOptionsButton
        className="action-menu-icon"
        onClick={this.handlePopupOpenClick}
        aria-haspopup="true"
        aria-owns="action-menu"
        aria-controls="action-menu"
      />
    );

    if (openButton) {
      openIconButton = open;
    }
    if (closeButton) {
      closeIconButton = close;
    }

    const icon = (this.state.anchorEl) ? closeIconButton : openIconButton;

    // support text or icon-driven menus
    let buttonContent;
    if (actionTextMsg) {
      buttonContent = (
        <Button
          className="action-menu-text"
          onClick={this.handlePopupOpenClick}
          aria-controls="action-menu"
          aria-haspopup="true"
          aria-owns="action-menu"
        >
          <FormattedMessage {...actionTextMsg} />
        </Button>
      );
    } else {
      buttonContent = icon;
    }

    return (
      <div className="action-icon-menu">
        {buttonContent}
        <Menu
          id="action-menu"
          anchorEl={anchorEl}
          onClose={this.handlePopupClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={Boolean(this.state.anchorEl)}
          getContentAnchorEl={null}
        >
          {children}
        </Menu>
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
