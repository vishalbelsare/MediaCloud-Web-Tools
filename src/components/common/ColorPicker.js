import React from 'react';
import { injectIntl } from 'react-intl';
import { GithubPicker } from 'react-color';
// import { getBrandDarkColor, getBrandDarkerColor } from '../../styles/colors';

class ColorPicker extends React.Component {

  state = {
    color: null,
    displayColorPicker: false,
  };

  handleClick = (props) => {
    const { color, onClick } = props;
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
    onClick({ color });
  };

  handleClose = (e) => {
    const { onChange } = this.props;
    this.setState({ displayColorPicker: false });
    onChange({ color: e.target.value });
  };

  render() {
    const { color } = this.props;
    let colorPicker = null;
    if (this.state.displayColorPicker) {
      colorPicker = <GithubPicker color={color} onChange={this.handleClose} />;
    } else {
      colorPicker = <a href="" onClick={this.handleClick}>pickcolor</a>;
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
