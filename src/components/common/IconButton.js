import React from 'react';
import Link from 'react-router/lib/Link';
import IconButton from 'material-ui/IconButton';
import { injectIntl } from 'react-intl';
import ArrowDropDownIcon from 'material-ui/svg-icons/navigation/arrow-drop-down';
import ArrowDropUpIcon from 'material-ui/svg-icons/navigation/arrow-drop-up';
import messages from '../../resources/messages';
import ExploreIcon from './icons/ExploreIcon';
import DownloadIcon from './icons/DownloadIcon';
import HelpIcon from './icons/HelpIcon';
import DeleteIcon from './icons/DeleteIcon';
import AddIcon from './icons/AddIcon';
import FilledStar from './icons/FilledStar';
import EmptyStar from './icons/EmptyStar';
import SettingsIcon from './icons/SettingsIcon';

/**
 * The wrapper for our custom icons.  The idea is that you define all the SVG icons in individual
 * Components in the `icons` directory, then export wrapper instances of them here.
 */
function composeIconButton(Icon, tooltipMessage) {
  class AppIconButton extends React.Component {
    handleClick = (event) => {
      const { onClick } = this.props;
      event.preventDefault();
      if (onClick) {
        onClick(event);
      }
    }
    render() {
      const { linkTo, onClick, color } = this.props;
      const { formatMessage } = this.props.intl;
      const linkTarget = linkTo || formatMessage(tooltipMessage);
      const clickHandler = (onClick) ? this.handleClick : null;
      return (
        <Link to={linkTarget} onClick={clickHandler} className="icon-button-link" name={formatMessage(tooltipMessage)}>
          <IconButton
            tooltip={formatMessage(tooltipMessage)}
            style={{ padding: 0, border: 0, width: 26, height: 26, color }}
            tooltipStyles={{ top: 20 }}
          >
            <Icon color={color} />
          </IconButton>
        </Link>
      );
    }
  }
  AppIconButton.propTypes = {
    onClick: React.PropTypes.func,
    linkTo: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.object,
    ]),
    intl: React.PropTypes.object.isRequired,
    color: React.PropTypes.string,
  };
  return injectIntl(AppIconButton);
}

export const ExploreButton = composeIconButton(ExploreIcon, messages.explore);

export const DownloadButton = composeIconButton(DownloadIcon, messages.download);

export const HelpButton = composeIconButton(HelpIcon, messages.help);

export const DeleteButton = composeIconButton(DeleteIcon, messages.delete);

export const AddButton = composeIconButton(AddIcon, messages.add);

export const FavoriteButton = composeIconButton(FilledStar, messages.unfavorite);

export const FavoriteBorderButton = composeIconButton(EmptyStar, messages.favorite);

export const ArrowDropDownButton = composeIconButton(ArrowDropDownIcon, messages.open);

export const ArrowDropUpButton = composeIconButton(ArrowDropUpIcon, messages.close);

export const SettingsButton = composeIconButton(SettingsIcon, messages.settings);
