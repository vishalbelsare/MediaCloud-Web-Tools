import React from 'react';
import Link from 'react-router/lib/Link';
import { injectIntl } from 'react-intl';
import messages from '../../resources/messages';
import ExploreIcon from './icons/ExploreIcon';
import DownloadIcon from './icons/DownloadIcon';

function composeIconButton(Icon) {
  class IconButton extends React.Component {
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
      const linkTarget = linkTo || formatMessage(messages.explore);
      const clickHandler = (onClick) ? this.handleClick : null;
      return (
        <Link to={linkTarget} onClick={clickHandler} name={formatMessage(messages.explore)}>
          <Icon />
        </Link>
      );
    }
  }
  IconButton.propTypes = {
    onClick: React.PropTypes.func,
    linkTo: React.PropTypes.func,
    intl: React.PropTypes.object.isRequired,
  };
  return injectIntl(IconButton);
}

export const ExploreButton = composeIconButton(ExploreIcon);

export const DownloadButton = composeIconButton(DownloadIcon);
