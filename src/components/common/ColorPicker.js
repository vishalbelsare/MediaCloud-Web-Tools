import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { GithubPicker } from 'react-color';

class ColorPicker extends React.Component {

  state = {
    color: null,
    displayColorPicker: false,
  };

  handleClick = () => {
    // const { color, onClick } = props;
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
    // onClick({ color });
  };

  handleClose = (color) => {
    const { onChange } = this.props;
    this.setState({ displayColorPicker: false });
    onChange({ name: 'color', value: color.hex });
  };

  render() {
    const { color } = this.props;
    let colorPicker = null;
    if (this.state.displayColorPicker) {
      colorPicker = <GithubPicker triangle="hide" color={color} onChange={this.handleClose} colors={['#B80000', '#DB3E00', '#FCCB00', '#008B02', '#006B76', '#1273DE', '#004DCF', '#5300EB']} />;
    } else {
      colorPicker = <button onClick={this.handleClick} style={{ cursor: 'pointer', width: 10, height: 10, borderRadius: 10, backgroundColor: `${color}`, display: 'inline-block' }} />;
    }
    return (
      <div className="color-picker">
        {colorPicker}
      </div>
    );
  }
}
ColorPicker.propTypes = {
  onClick: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  color: PropTypes.string,
};

export default injectIntl(ColorPicker);
