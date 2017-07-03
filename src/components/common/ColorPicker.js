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
      colorPicker = <GithubPicker color={color} onChange={this.handleClose} />;
    } else {
      colorPicker = <button onClick={this.handleClick}><span style={{ width: 10, height: 10, backgroundColor: `${color}`, display: 'inline-block' }} /></button>;
    }
    return (
      <div className="color-picker">
        {colorPicker}
      </div>
    );
  }
}
ColorPicker.propTypes = {
  onClick: React.PropTypes.func,
  onChange: React.PropTypes.func.isRequired,
  color: React.PropTypes.string,
};

export default injectIntl(ColorPicker);
