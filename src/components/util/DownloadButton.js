import React from 'react';
import IconButton from 'material-ui/IconButton';

class DownloadButton extends React.Component {
  getStyles() {
    const { padding } = this.props;
    const paddingToUse = (padding !== undefined) ? padding : 10;
    const styles = {
      floatRight: {
        float: 'right',
      },
    };
    return styles;
  }
  render() {
    const { tooltip, onClick, floatRight } = this.props;
    const styles = this.getStyles();
    const float = (floatRight!==undefined) ? floatRight : true;
    const wrapperStyles = (float) ? styles.floatRight : {};
    return (
    <div style={wrapperStyles}>
      <IconButton iconClassName="material-icons" tooltip={tooltip} onClick={onClick}>
        get_app
      </IconButton>
    </div>
    );
  }
}

DownloadButton.propTypes = {
  tooltip: React.PropTypes.string,
  onClick: React.PropTypes.func,
  floatRight: React.PropTypes.bool, // defaults to true
};

export default DownloadButton;
