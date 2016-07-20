import React from 'react';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import { getBrandDarkColor } from '../../styles/colors';
import Link from 'react-router/lib/Link';

class DownloadButton extends React.Component {
  getStyles() {
    const styles = {
      root: {
      },
    };
    return styles;
  }
  render() {
    const { tooltip, onClick } = this.props;
    const styles = this.getStyles();
    return (
    <Link to="#" onClick={onClick} name={tooltip}>
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
