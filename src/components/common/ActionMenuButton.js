import React from 'react';
import { injectIntl } from 'react-intl';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import DownloadIcon from './icons/DownloadIcon';
import MoreOptionsIcon from './icons/MoreOptionsIcon';
// import messages from '../../resources/messages';

// import DownloadIcon from './icons/DownloadIcon';
import { getBrandDarkColor, getBrandDarkerColor } from '../../styles/colors';

class ActionMenuButton extends React.Component {
  state = {
    backgroundColor: getBrandDarkColor(),
  };
  handleMouseEnter = () => {
    this.setState({ backgroundColor: getBrandDarkerColor() });
  }
  handleMouseLeave = () => {
    this.setState({ backgroundColor: getBrandDarkColor() });
  }
  handleClick = (event) => {
    const { onClick } = this.props;
    event.preventDefault();
    if (onClick) {
      onClick(event);
    }
  }
  render() {
    const { actionItems, topLevelButton, useBackgroundColor } = this.props;
    // const { formatMessage } = this.props.intl;
    // const displayTooltip = ((tooltip !== undefined) && (tooltip !== null)) ? tooltip : formatMessage(...messages.defaultActionMenuButtonTooltip);
    const otherProps = {};
    if (useBackgroundColor === true) {
      otherProps.backgroundColor = this.state.backgroundColor;
    }
    return (
      <div className="action-menu-button">
        <IconMenu iconButtonElement={topLevelButton || <IconButton><MoreOptionsIcon /></IconButton>}>
          {actionItems.map((item, idx) => (
            <MenuItem
              key={idx}
              primaryText={item.text}
              onTouchTap={() => item.clickHandler()}
              rightIcon={<DownloadIcon />}
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
};

export default injectIntl(ActionMenuButton);
