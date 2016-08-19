import React from 'react';
import FontIcon from 'material-ui/FontIcon';
import Link from 'react-router/lib/Link';
import { injectIntl } from 'react-intl';
import { getBrandDarkColor } from '../../styles/colors';
import messages from '../../resources/messages';

class DownloadButton extends React.Component {

  handleClick = (event) => {
    const { onClick } = this.props;
    event.preventDefault();
    onClick();
  }

  render() {
    const { tooltip } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <Link to={formatMessage(messages.download)} onClick={this.handleClick} name={tooltip}>
        <FontIcon className="material-icons" color={getBrandDarkColor()}>file_download</FontIcon>
      </Link>
    );
  }

}

DownloadButton.propTypes = {
  tooltip: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func.isRequired,
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(DownloadButton);
