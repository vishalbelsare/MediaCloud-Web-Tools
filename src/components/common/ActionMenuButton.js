import React from 'react';
import { injectIntl } from 'react-intl';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import DownloadIcon from './icons/DownloadIcon';
import MoreOptionsIcon from './icons/MoreOptionsIcon';
import CloseIcon from './icons/CloseIcon';

import { getBrandDarkColor, getBrandDarkerColor } from '../../styles/colors';

const localMessages = {
  defaultTooltipMessage: { id: 'actionmenu.defaulttooltip', defaultMessage: 'More Options' },
};

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
    const { actionItems, useBackgroundColor, color, iconStyle, tooltip, openButton, closeButton } = this.props;
    const { formatMessage } = this.props.intl;

    const otherProps = {};
    if (useBackgroundColor === true) {
      otherProps.backgroundColor = this.state.backgroundColor;
    }
    let closeIconButton = (
      <IconButton iconStyle={iconStyle || {}}>
        <CloseIcon color={color} {...otherProps} />
      </IconButton>
    );
    let openIconButton = (
      <IconButton style={{ padding: 0, border: 0, width: 26, height: 26, color }} >
        <MoreOptionsIcon color={color} {...otherProps} />
      </IconButton>
    );

    if (openButton) {
      openIconButton = open;
    }
    if (closeButton) {
      closeIconButton = close;
    }

    const defaultIconButton = (
      <IconButton iconStyle={iconStyle || {}} >
        <DownloadIcon color={color} {...otherProps} />
      </IconButton>
    );

    const icon = (this.state.isPopupOpen) ? closeIconButton : openIconButton;
    const displayTooltip = ((tooltip !== undefined) && (tooltip !== null)) ? tooltip : formatMessage(localMessages.defaultTooltipMessage);

    return (
      <div className="action-icon-menu">
        <IconMenu
          open={this.state.isPopupOpen}
          iconButtonElement={icon}
          tooltip={displayTooltip}
          onRequestChange={() => this.handlePopupOpenClick(event)}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'right', vertical: 'top' }}
        >
          {actionItems.map((item, idx) => {
            const rtIcon = item.icon;
            let rtIconButton;
            if (rtIcon) {
              rtIconButton = <IconButton>{rtIcon}</IconButton>;
            } else {
              rtIconButton = defaultIconButton;
            }


            return (<MenuItem
              className="action-icon-menu-item"
              key={idx}
              primaryText={item.text}
              onTouchTap={() => item.clickHandler()}
              onRequestClose={() => this.handlePopupRequestClose(event)}
              rightIcon={rtIconButton}
            />);
          })
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
  openButton: React.PropTypes.object,
  closeButton: React.PropTypes.object,
  tooltip: React.PropTypes.string,
  intl: React.PropTypes.object.isRequired,
  color: React.PropTypes.string,
  useBackgroundColor: React.PropTypes.bool,
  iconStyle: React.PropTypes.object,
};

export default injectIntl(ActionMenuButton);
