import React from 'react';
import { reduxForm } from 'redux-form';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { loginWithPassword } from './userActions';

const LoginFormComponent = (props) => {
  const { fields: { email, password }, handleSubmit, onSubmitLoginForm, isSubmitting, location } = props;
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
        value={ (location && location.state && location.state.nextPathname) ? location.state.nextPathname : ''}
      />
      <br />
      <RaisedButton type="submit" label="Login" primary disabled={isSubmitting} />
    </form>
  );
};

LoginFormComponent.propTypes = {
  fields: React.PropTypes.object.isRequired,
  onSubmitLoginForm: React.PropTypes.func.isRequired,
  isSubmitting: React.PropTypes.bool.isRequired,
  location: React.PropTypes.object.isRequired,
  handleSubmit: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isSubmitting: state.user.isFetching,
});

const mapDispatchToProps = (dispatch) => ({
  onSubmitLoginForm: (values) => {
    dispatch(loginWithPassword(values.email, values.password, values.destination));
  },
});

// in-browser validation callback
function validate(values) {
  const errors = {};
  if (!values.email || values.email.trim() === '') {
    errors.email = 'You forgot to enter your email address';
  }
  if (!values.password || values.password.trim() === '') {
    errors.password = 'You forgot to enter your password';
  }
  return errors;
}

const reduxFormConfig = {
  form: 'login',
  fields: ['email', 'password', 'destination'],
  validate,
};

const LoginForm = reduxForm(reduxFormConfig, mapStateToProps, mapDispatchToProps)(LoginFormComponent);

export default LoginForm;
