import React from 'react';
import FontIcon from 'material-ui/FontIcon';
import { getBrandDarkColor } from '../../styles/colors';
import Link from 'react-router/lib/Link';

class DownloadButton extends React.Component {

  handleClick = (event) => {
    const { onClick } = this.props;
    event.preventDefault();
    onClick();
  }

  render() {
    const { tooltip } = this.props;
    return (
      <Link to="#" onClick={this.handleClick} name={tooltip}>
        <FontIcon className="material-icons" color={getBrandDarkColor()}>file_download</FontIcon>
      </Link>
    );
  }

}

DownloadButton.propTypes = {
  tooltip: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func.isRequired,
};

export default DownloadButton;
