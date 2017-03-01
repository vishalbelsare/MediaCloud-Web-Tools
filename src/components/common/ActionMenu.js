import React from 'react';
import { injectIntl } from 'react-intl';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreOptionsIcon from './icons/MoreOptionsIcon';
import CloseIcon from './icons/CloseIcon';

import { getBrandDarkColor, getBrandDarkerColor } from '../../styles/colors';

class ActionMenu extends React.Component {
  state = {
    backgroundColor: getBrandDarkColor(),
    isPopupOpen: false,
  };

  handlePopupOpenClick = (event) => {
    if (event) {
      event.preventDefault();
      this.setState({
        isPopupOpen: !this.state.isPopupOpen,
        anchorEl: event.currentTarget,
      });
    } else {
      this.setState({
        isPopupOpen: !this.state.isPopupOpen,
      });
    }
  }
  handleMouseEnter = () => {
    this.setState({ backgroundColor: getBrandDarkerColor() });
  }
  handleMouseLeave = () => {
    this.setState({ backgroundColor: getBrandDarkColor() });
  }

  render() {
    const { actionItems, color, openButton, closeButton } = this.props;

    const otherProps = {};
    otherProps.backgroundColor = this.state.backgroundColor;
    let closeIconButton = (
      <IconButton style={{ padding: 0, margin: 0, width: 26, height: 26 }} >
        <CloseIcon color={color} {...otherProps} />
      </IconButton>
    );
    let openIconButton = (
      <IconButton style={{ padding: 0, margin: 0, width: 26, height: 26 }} >
        <MoreOptionsIcon color={color} {...otherProps} />
      </IconButton>
    );

    if (openButton) {
      openIconButton = open;
    }
    if (closeButton) {
      closeIconButton = close;
    }

    const icon = (this.state.isPopupOpen) ? closeIconButton : openIconButton;

    return (
      <div className="action-icon-menu">
        <IconMenu
          open={this.state.isPopupOpen}
          iconButtonElement={icon}
          onRequestChange={() => this.handlePopupOpenClick(event)}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'right', vertical: 'top' }}
        >
          {actionItems.map((item, idx) => (
            <MenuItem
              className="action-icon-menu-item"
              key={idx}
              primaryText={item.text}
              onTouchTap={() => item.clickHandler()}
              rightIcon={item.icon}
              disabled={item.disabled === true}
            />
          ))
        }
        </IconMenu>
      </div>
    );
  }
}
ActionMenu.propTypes = {
  onClick: React.PropTypes.func,
  topLevelButton: React.PropTypes.func,
  actionItems: React.PropTypes.array.isRequired,
  openButton: React.PropTypes.object,
  closeButton: React.PropTypes.object,
  tooltip: React.PropTypes.string,
  intl: React.PropTypes.object.isRequired,
  color: React.PropTypes.string,
  iconStyle: React.PropTypes.object,
};

export default injectIntl(ActionMenu);
