import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

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
    return (<RaisedButton
      className={`app-button ${this.state.hoverClass}`}
      onMouseEnter={this.handleMouseEnter}
      onMouseLeave={this.handleMouseLeave}
      {...this.props}
    />);
  }

}

AppButton.propTypes = {
  // from parent
  disabled: React.PropTypes.bool,
};

export default AppButton;
