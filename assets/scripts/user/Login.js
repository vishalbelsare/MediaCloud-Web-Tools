import React, {Component} from 'react';
import {connect} from 'react-redux';
import Title from 'react-title-component';

import LoginForm from './LoginForm';
import FullWidthSection from '../components/FullWidthSection';

const LoginContainer = React.createClass({
  propTypes: {
    isLoggedIn: React.PropTypes.bool.isRequired
  },
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },
  componentDidMount() {
    if(this.props.isLoggedIn){
      this.context.router.push("/home");
    }
  },
  render() {
    return (
      <div>
        <Title render={parentTitle => `Login | ${parentTitle}`}/>
        <h2>Login</h2>
        <LoginForm location={this.props.location}/>
      </div>
    );
  }
});

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn
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