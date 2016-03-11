import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';

class LoginForm extends Component {
  render() {
    const {fields: {email, password}, handleSubmit} = this.props;
    return (
      <div>
        <TextField
        floatingLabelText="Email"
          {...email}
        />
        <br />
        <TextField
          floatingLabelText="Password"
          type="password"
          {...password}
        />
        <br />
        <RaisedButton type="submit" label="Login" primary={true} />
      </div>
    );
  }
}

LoginForm = reduxForm({
  form: 'login',
  fields: ['email', 'password']
})(LoginForm);

export default LoginForm;