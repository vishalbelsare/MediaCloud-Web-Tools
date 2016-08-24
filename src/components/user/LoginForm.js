import React from 'react';
import { reduxForm } from 'redux-form';
import { injectIntl } from 'react-intl';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { push } from 'react-router-redux';
import { loginWithPassword, setLoginErrorMessage } from '../../actions/userActions';
import * as fetchConstants from '../../lib/fetchConstants.js';
import messages from '../../resources/messages';
import { notEmptyString } from '../../lib/formValidators';

const LoginFormComponent = (props) => {
  const { fields: { email, password }, handleSubmit, onSubmitLoginForm, fetchStatus, errorMessage } = props;
  const { formatMessage } = props.intl;
  let emailError = errorMessage;
  if (emailError === null) {
    emailError = email.touched ? email.error : '';
  }
  return (
    <form onSubmit={handleSubmit(onSubmitLoginForm.bind(this))} className="login-form">
      <TextField
        floatingLabelText={formatMessage(messages.userEmail)}
        errorText={emailError}
        {...email}
      />
      <br />
      <TextField
        floatingLabelText={formatMessage(messages.userPassword)}
        type="password"
        errorText={password.touched ? password.error : ''}
        {...password}
      />
      <br />
      <RaisedButton type="submit" label="Login" primary disabled={fetchStatus === fetchConstants.FETCH_ONGOING} />
    </form>
  );
};

LoginFormComponent.propTypes = {
  // from composition
  intl: React.PropTypes.object.isRequired,
  fields: React.PropTypes.object.isRequired,
  location: React.PropTypes.object.isRequired,
  handleSubmit: React.PropTypes.func.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  errorMessage: React.PropTypes.string,
  // from dispatch
  onSubmitLoginForm: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  fetchStatus: state.user.fetchStatus,
  errorMessage: state.user.errorMessage,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSubmitLoginForm: (values) => {
    dispatch(loginWithPassword(values.email, values.password, values.destination))
    .then((response) => {
      if (response.status === 401) {
        dispatch(setLoginErrorMessage(ownProps.intl.formatMessage(messages.userLoginFailed)));
      } else {
        // redirect to destination if there is one
        const loc = ownProps.location;
        const redirect = (loc && loc.state && loc.state.nextPathname) ? loc.state.nextPathname : '';
        if (redirect) {
          dispatch(push(redirect));
        }
      }
    });
  },
});

// in-browser validation callback
function validate(values) {
  const errors = {};
  if (!notEmptyString(values.email)) {
    errors.email = 'You forgot to enter your email address';
  }
  if (!notEmptyString(values.password)) {
    errors.password = 'You forgot to enter your password';
  }
  return errors;
}

const reduxFormConfig = {
  form: 'login',
  fields: ['email', 'password'],
  validate,
};

export default
  injectIntl(
    reduxForm(reduxFormConfig, mapStateToProps, mapDispatchToProps)(
      LoginFormComponent
    )
  );
