import React from 'react';
import { connect } from 'react-redux';
import Title from 'react-title-component';

import LoginForm from './LoginForm';

class LoginContainer extends React.Component {
  componentDidMount() {
    if (this.props.isLoggedIn) {
      this.context.router.push('/home');
    }
  }
  render() {
    const titleHandler = parentTitle => `Login | ${parentTitle}`;
    return (
      <div>
        <Title render={titleHandler} />
        <h2>Login</h2>
        <LoginForm location={this.props.location} />
      </div>
    );
  }
}

LoginContainer.propTypes = {
  isLoggedIn: React.PropTypes.bool.isRequired,
  location: React.PropTypes.object.isRequired
};

LoginContainer.contextTypes = {
  router: React.PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  isLoggedIn: state.user.isLoggedIn
});

const Login = connect(
  mapStateToProps,
  null
)(LoginContainer);

export default Login;
