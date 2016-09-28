import React from 'react';
import Link from 'react-router/lib/Link';
import IconButton from 'material-ui/IconButton';
import FavoriteIcon from 'material-ui/svg-icons/action/favorite';
import FavoriteBorderIcon from 'material-ui/svg-icons/action/favorite-border';
import { injectIntl } from 'react-intl';
import messages from '../../resources/messages';
import ExploreIcon from './icons/ExploreIcon';
import DownloadIcon from './icons/DownloadIcon';
import HelpIcon from './icons/HelpIcon';
import DeleteIcon from './icons/DeleteIcon';
import AddIcon from './icons/AddIcon';

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
        onClick();
      }
    }
    render() {
      const { linkTo, onClick } = this.props;
      const { formatMessage } = this.props.intl;
      const linkTarget = linkTo || formatMessage(tooltipMessage);
      const clickHandler = (onClick) ? this.handleClick : null;
      return (
        <Link to={linkTarget} onClick={clickHandler} className="icon-button-link" name={formatMessage(tooltipMessage)}>
          <IconButton
            tooltip={formatMessage(tooltipMessage)}
            style={{ padding: 0, border: 0, width: 26, height: 26 }}
            tooltipStyles={{ top: 20 }}
          >
            <Icon />
          </IconButton>
        </Link>
      );
    }
  }
  AppIconButton.propTypes = {
    onClick: React.PropTypes.func,
    linkTo: React.PropTypes.string,
    intl: React.PropTypes.object.isRequired,
  };
  return injectIntl(AppIconButton);
}

export const ExploreButton = composeIconButton(ExploreIcon, messages.explore);

export const DownloadButton = composeIconButton(DownloadIcon, messages.download);

export const HelpButton = composeIconButton(HelpIcon, messages.help);

export const DeleteButton = composeIconButton(DeleteIcon, messages.delete);

export const AddButton = composeIconButton(AddIcon, messages.delete);

export const FavoriteButton = composeIconButton(FavoriteIcon, messages.unfavorite);

export const FavoriteBorderButton = composeIconButton(FavoriteBorderIcon, messages.favorite);
