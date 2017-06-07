import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { replace } from 'react-router-redux';
import { signupUser } from '../../actions/userActions';
// import { updateFeedback } from '../../actions/appActions';
import AppButton from '../common/AppButton';
import Captcha from '../common/form/Captcha';
import messages from '../../resources/messages';
import { emptyString, invalidEmail } from '../../lib/formValidators';
import composeIntlForm from '../common/IntlForm';
import { addNotice } from '../../actions/appActions';

const localMessages = {
  intro: { id: 'user.signup.intro', defaultMessage: 'Create an account to use all our tools for free.' },
  missingEmail: { id: 'user.missingEmail', defaultMessage: 'You need to enter a valid email address.' },
  missingFullname: { id: 'user.missingName', defaultMessage: 'You need to enter your full name.' },
  missingPassword: { id: 'user.missingPassword', defaultMessage: 'You need to enter your password.' },
  passwordsMismatch: { id: 'user.mismatchPassword', defaultMessage: 'Passwords do not match.' },
  feedback: { id: 'user.signUp.feedback', defaultMessage: 'Successfully signed up.' },
  notesHint: { id: 'user.notes.hint', defaultMessage: 'Tell us a little about what you want to use Media Cloud for' },
  subscribeToNewsletter: { id: 'user.signUp.subscribeToNewsletter', defaultMessage: 'Subscribe to Newsletter?' },
  signupSuccess: { id: 'user.signUp.success',
    defaultMessage: '<h1>Clink the link we just emailed you</h1>' +
    '<p>To make sure your email is valid, we have sent you a message with a magic link for you to click.  Click the link in the email to confirm that we got your email right.<p>' +
    '<p><a href="post-to-recover-password">Click here to send the email again</a>.</p>.' },
};

class SignupContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { allowSignup: false };
  }
  passedCaptcha() {
    this.setState({ passedCaptcha: true });
  }
  render() {
    const { handleSubmit, handleSignupSubmission, pristine, submitting, renderTextField, renderCheckbox } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <Grid>
        <form onSubmit={handleSubmit(handleSignupSubmission.bind(this))} className="app-form signup-form">
          <Row>
            <Col lg={12}>
              <h1><FormattedMessage {...messages.userSignup} /></h1>
              <p><FormattedMessage {...localMessages.intro} /></p>
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <Field
                name="email"
                fullWidth
                component={renderTextField}
                floatingLabelText={messages.userEmail}
              />
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <Field
                name="fullName"
                type="text"
                fullWidth
                component={renderTextField}
                floatingLabelText={messages.userFullName}
              />
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <Field
                name="password"
                type="password"
                fullWidth
                component={renderTextField}
                floatingLabelText={messages.userPassword}
              />
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <Field
                name="confirmPassword"
                type="password"
                fullWidth
                component={renderTextField}
                floatingLabelText={messages.userConfirmPassword}
              />
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <Field
                name="notes"
                multiLine
                fullWidth
                rows={2}
                rowsMax={4}
                component={renderTextField}
                hintText={localMessages.notesHint}
                floatingLabelText={messages.userNotes}
              />
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <Field
                name="subscribeToNewsletter"
                component={renderCheckbox}
                label={localMessages.subscribeToNewsletter}
              />
            </Col>
          </Row>
          <Row>
            <Captcha onChange={() => this.passedCaptcha()} />
          </Row>
          <Row>
            <Col lg={12}>
              <AppButton
                type="submit"
                label={formatMessage(messages.userSignup)}
                primary
                disabled={!this.state.passedCaptcha || pristine || submitting}
              />
            </Col>
          </Row>
        </form>
      </Grid>
    );
  }
}

SignupContainer.propTypes = {
  // from composition
  intl: React.PropTypes.object.isRequired,
  location: React.PropTypes.object,
  redirect: React.PropTypes.string,
  handleSubmit: React.PropTypes.func.isRequired,
  renderTextField: React.PropTypes.func.isRequired,
  renderCheckbox: React.PropTypes.func.isRequired,
  pristine: React.PropTypes.bool.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  // from dispatch
  handleSignupSubmission: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.user.fetchStatus,
});

const mapDispatchToProps = dispatch => ({
  handleSignupSubmission: (values) => {
    dispatch(signupUser(values))
    .then((response) => {
      if (response.success !== 1) {
        dispatch(addNotice(response.error));
      } else {
        dispatch(replace('/#/user/signup-success'));
      }
    });
  },
});

// in-browser validation callback
function validate(values) {
  const errors = {};
  if (invalidEmail(values.email)) {
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
          SignupContainer
        )
      )
    )
  );
