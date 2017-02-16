import React from 'react';
import { injectIntl } from 'react-intl';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import DownloadIcon from './icons/DownloadIcon';
import MoreOptionsIcon from './icons/MoreOptionsIcon';
import CloseIcon from './icons/CloseIcon';
// import messages from '../../resources/messages';

// import DownloadIcon from './icons/DownloadIcon';
import { getBrandDarkColor, getBrandDarkerColor } from '../../styles/colors';

class ActionMenuButton extends React.Component {
  state = {
    backgroundColor: getBrandDarkColor(),
    isPopupOpen: false,
  };

  handlePopupOpenClick = (event) => {
    event.preventDefault();
    this.setState({
      isPopupOpen: !this.state.isPopupOpen,
      anchorEl: event.currentTarget,
    });
  }
  handlePopupRequestClose = () => {
    this.setState({
      isPopupOpen: false,
    });
  }
  handleMouseEnter = () => {
    this.setState({ backgroundColor: getBrandDarkerColor() });
  }
  handleMouseLeave = () => {
    this.setState({ backgroundColor: getBrandDarkColor() });
  }

  render() {
    const { actionItems, useBackgroundColor, color, iconStyle } = this.props;
    const otherProps = {};
    if (useBackgroundColor === true) {
      otherProps.backgroundColor = this.state.backgroundColor;
    }
    const closeIcon = (
      <IconButton>
        <CloseIcon color={color} {...otherProps} />
      </IconButton>
    );
    const openIcon = (
      <IconButton iconStyle={iconStyle || {}} >
        <MoreOptionsIcon color={color} {...otherProps} />
      </IconButton>
    );
    const defaultIcon = (
      <IconButton iconStyle={iconStyle || {}} >
        <DownloadIcon color={color} {...otherProps} />
      </IconButton>
    );
    // const { formatMessage } = this.props.intl;
    // const displayTooltip = ((tooltip !== undefined) && (tooltip !== null)) ? tooltip : formatMessage(...messages.defaultActionMenuButtonTooltip);
    const icon = (this.state.isPopupOpen) ? closeIcon : openIcon;
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
              onRequestClose={() => this.handlePopupRequestClose(event)}
              rightIcon={item.icon || defaultIcon}
            />
          ))
          }
        </IconMenu>
      </div>
    );
  }
}
ActionMenuButton.propTypes = {
  onClick: React.PropTypes.func,
  topLevelButton: React.PropTypes.func,
  actionItems: React.PropTypes.array.isRequired,
  tooltip: React.PropTypes.string,
  intl: React.PropTypes.object.isRequired,
  color: React.PropTypes.string,
  useBackgroundColor: React.PropTypes.bool,
  iconStyle: React.PropTypes.object,
};

export default injectIntl(ActionMenuButton);
