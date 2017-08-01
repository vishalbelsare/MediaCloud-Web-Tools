import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

/**
 * Simple wrapper so we can style all the button the same.  Use this instead of
 * material-ui's RaisedButton.
 * @see http://stackoverflow.com/questions/39458150/is-it-possible-to-add-a-custom-hover-color-to-raised-buttons
 */
class AppButton extends React.Component {

  state = {
    hoverClass: '',
  };

  handleMouseEnter = () => {
    const { disabled } = this.props;
    if ((disabled === false) || (disabled === undefined)) {
      this.setState({ hoverClass: 'hovering' });
    }
  }

  handleMouseLeave = () => {
    this.setState({ hoverClass: '' });
  }

  render() {
    const { flat, className } = this.props;
    const customClassName = className || '';
    const buttonProps = {
      onMouseEnter: this.handleMouseEnter,
      onMouseLeave: this.handleMouseLeave,
      ...this.props,
      className: `app-button ${this.state.hoverClass} ${customClassName}`,
    };
    let content = null;
    if (flat) {
      delete buttonProps.flat;
      content = <FlatButton {...buttonProps} />;
    } else {
      content = <RaisedButton {...buttonProps} />;
    }
    return content;
  }

}

AppButton.propTypes = {
  // from parent
  disabled: React.PropTypes.bool,
  flat: React.PropTypes.bool,
  className: React.PropTypes.string,
};

export default AppButton;
