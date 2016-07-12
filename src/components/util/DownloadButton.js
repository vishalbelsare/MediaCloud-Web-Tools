import React from 'react';
import IconButton from 'material-ui/IconButton';

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
    <div style={styles.root}>
      <IconButton iconClassName="material-icons" tooltip={tooltip} onClick={onClick}>
        file_download
      </IconButton>
    </div>
    );
  }
}

DownloadButton.propTypes = {
  tooltip: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func.isRequired,
};

export default DownloadButton;
