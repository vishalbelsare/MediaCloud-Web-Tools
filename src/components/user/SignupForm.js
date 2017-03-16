import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import ReCAPTCHA from 'react-google-recaptcha';
import { replace } from 'react-router-redux';
import { signupUser, setLoginErrorMessage } from '../../actions/userActions';
// import { updateFeedback } from '../../actions/appActions';
import AppButton from '../common/AppButton';
import messages from '../../resources/messages';
import { emptyString } from '../../lib/formValidators';
import composeIntlForm from '../common/IntlForm';

const localMessages = {
  missingEmail: { id: 'user.missingEmail', defaultMessage: 'You need to enter your email address.' },
  missingFullname: { id: 'user.missingName', defaultMessage: 'You need to enter your full name.' },
  missingPassword: { id: 'user.missingPassword', defaultMessage: 'You need to enter your password.' },
  passwordsMismatch: { id: 'user.mismatchPassword', defaultMessage: 'Passwords do not match.' },
  loginFailed: { id: 'user.loginFailed', defaultMessage: 'Your email or password was wrong.' },
  signUpNow: { id: 'user.signUpNow', defaultMessage: 'No account? Register now' },
  feedback: { id: 'user.signUp.feedback', defaultMessage: 'Successfully signed up.' },
  signupSuccess: { id: 'user.signUp.success',
    defaultMessage: '<h1>Clink the link we just emailed you</h1>' +
    '<p>To make sure your email is valid, we have sent you a message with a magic link for you to click.  Click the link in the email to confirm that we got your email right.<p>' +
    '<p><a href="post-to-recover-password">Click here to send the email again</a>.</p>.' },
};

class SignupForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { allowSignup: false };
  }
  allowSignin() {
    this.setState({ allowSignin: true });
  }
  // let recaptchaInstance = null;
  // const titleHandler = parentTitle => `${formatMessge(messages.userSignup)} | ${parentTitle}`;
  render() {
    const { handleSubmit, onSubmitSignupForm, pristine, submitting, renderTextField, errorMessage } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <Grid>
        <form onSubmit={handleSubmit(onSubmitSignupForm.bind(this))} className="signup-form">
          <Row>
            <Col lg={12} md={12} sm={12}>
              <h2><FormattedMessage {...messages.userSignup} /></h2>
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <Field
                errors={errorMessage}
                name="email"
                component={renderTextField}
                floatingLabelText={messages.userEmail}
              />
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <Field
                errors={errorMessage}
                name="full_name"
                type="text"
                component={renderTextField}
                floatingLabelText={messages.userFullName}
              />
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <Field
                errors={errorMessage}
                name="confirm_password"
                type="password"
                component={renderTextField}
                floatingLabelText={messages.userConfirmPassword}
              />
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <Field
                errors={errorMessage}
                name="password"
                type="password"
                component={renderTextField}
                floatingLabelText={messages.userPassword}
              />
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <Field
                name="notes"
                multiLine
                rows={2}
                rowsMax={4}
                component={renderTextField}
                floatingLabelText={messages.userNotes}
              />
            </Col>
          </Row>
          <Row>
            <ReCAPTCHA sitekey="6Le8zhgUAAAAANfXdzoR0EFXNcjZnVTRhIh6JVnG" onChange={() => { this.allowSignin(); }} />
          </Row>
          <Row>
            <AppButton
              type="submit"
              label={formatMessage(messages.userSignup)}
              primary
              disabled={!this.state.allowSignin || (pristine || submitting || errorMessage === '')}
            />
            <Col lg={12}>
              <br />
              <a href="/#/login">
                <AppButton
                  flat
                  label={formatMessage(localMessages.signUpNow)}
                />
              </a>
            </Col>
          </Row>
        </form>
      </Grid>
    );
  }
}

SignupForm.propTypes = {
  // from composition
  intl: React.PropTypes.object.isRequired,
  location: React.PropTypes.object,
  redirect: React.PropTypes.string,
  handleSubmit: React.PropTypes.func.isRequired,
  renderTextField: React.PropTypes.func.isRequired,

  pristine: React.PropTypes.bool.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  errorMessage: React.PropTypes.string,
  // from dispatch
  onSubmitSignupForm: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.user.fetchStatus,
  errorMessage: state.user.errorMessage,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSubmitSignupForm: (values) => {
    dispatch(signupUser(values))
    .then((response) => {
      if (response.status === 401) {
        dispatch(setLoginErrorMessage(ownProps.intl.formatMessage(localMessages.loginFailed)));
      } else {
        // dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(localMessages.feedback) }));
        dispatch(replace('/#/signup-success'));
      }
    });
  },
});

// in-browser validation callback
function validate(values) {
  const errors = {};
  if (emptyString(values.email)) {
    errors.email = localMessages.missingEmail;
  }
  if (emptyString(values.full_name)) {
    errors.email = localMessages.missingName;
  }
  if (emptyString(values.password)) {
    errors.password = localMessages.missingPassword;
  }
  if ((values.password !== undefined && values.confirm_password !== undefined) && values.password !== values.confirm_password) {
    errors.password = localMessages.passwordsMismatch;
  }
  return errors;
}

const reduxFormConfig = {
  form: 'signup-form',
  validate,
};

export default
  injectIntl(
    composeIntlForm(
      reduxForm(reduxFormConfig)(
        connect(mapStateToProps, mapDispatchToProps)(
          SignupForm
        )
      )
    )
  );
