import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';
import { loginWithPassword } from './userActions';

class LoginFormComponent extends Component {
  render() {
    const {fields: {email, password, destination}, handleSubmit, onSubmitLoginForm, isSubmitting, location} = this.props;
    return (
      <form onSubmit={handleSubmit(onSubmitLoginForm.bind(this))}>
        <TextField
          floatingLabelText="Email"
          errorText={email.touched ? email.error : ''}
          {...email}
        />
        <br />
        <TextField
          floatingLabelText="Password"
          type="password"
          errorText={password.touched ? password.error : ''}
          {...password}
        />
        <input type="hidden" name="destination" 
          value={ (location && location.state && location.state.nextPathname) ? location.state.nextPathname : ''} />
        <br />
        <RaisedButton type="submit" label="Login" primary={true} disabled={isSubmitting}/>
      </form>
    );
  }
}
LoginFormComponent.propTypes = {
  fields: React.PropTypes.object.isRequired,
  onSubmitLoginForm: React.PropTypes.func.isRequired,
  isSubmitting: React.PropTypes.bool.isRequired,
  location: React.PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    isSubmitting: state.user.isFetching
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSubmitLoginForm: (values) => {
      dispatch(loginWithPassword(values.email,values.password,values.destination));
    }
  };
};

// in-browser validation callback
function validate(values){
  const errors = {};
  if (!values.email || values.email.trim() === '') {
    errors.email = "You forgot to enter your email address";
  }
  if (!values.password || values.password.trim() === '') {
    errors.password = "You forgot to enter your password";
  }
  return errors;
}

const reduxFormConfig = {
  form: 'login',
  fields: ['email', 'password', 'destination'],
  validate
}

const LoginForm = reduxForm(reduxFormConfig,mapStateToProps,mapDispatchToProps)(LoginFormComponent);

export default LoginForm;