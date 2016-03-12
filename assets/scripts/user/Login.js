import React, {Component} from 'react';
import {connect} from 'react-redux';

import LoginForm from './LoginForm';
import FullWidthSection from '../components/FullWidthSection';

function LoginContainer({}) {
  return (
    <div>
      <h2>Login</h2>
      <LoginForm/>
    </div>
  );
}

LoginContainer.propTypes = {
}

const mapStateToProps = (state) => {
  return {
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

let Login = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginContainer);

export default Login;