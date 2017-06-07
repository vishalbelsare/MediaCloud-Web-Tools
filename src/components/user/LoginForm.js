import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Row, Col } from 'react-flexbox-grid/lib';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router';
import { push } from 'react-router-redux';
import { loginWithPassword } from '../../actions/userActions';
// import { addNotice } from '../../actions/appActions';
import AppButton from '../common/AppButton';
import * as fetchConstants from '../../lib/fetchConstants';
import messages from '../../resources/messages';
import { emptyString, invalidEmail } from '../../lib/formValidators';
import composeIntlForm from '../common/IntlForm';

const localMessages = {
  missingEmail: { id: 'user.missingEmail', defaultMessage: 'You need to enter your email address.' },
  missingPassword: { id: 'user.missingPassword', defaultMessage: 'You need to enter your password.' },
  loginFailed: { id: 'user.loginFailed', defaultMessage: 'Your email or password was wrong.' },
  signUpNow: { id: 'user.signUpNow', defaultMessage: 'No account? Register now!' },
  forgotPassword: { id: 'user.forgotPassword', defaultMessage: 'Forgot Your Password?' },
};

const LoginFormComponent = (props) => {
  const { handleSubmit, onSubmitLoginForm, fetchStatus, renderTextField } = props;
  const { formatMessage } = props.intl;
  return (
    <form onSubmit={handleSubmit(onSubmitLoginForm.bind(this))} className="app-form login-form">
      <Row>
        <Col lg={12}>
          <Field
            name="email"
            component={renderTextField}
            floatingLabelText={messages.userEmail}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <Field
            name="password"
            type="password"
            component={renderTextField}
            floatingLabelText={messages.userPassword}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <br />
          <AppButton
            type="submit"
            label={formatMessage(messages.userLogin)}
            primary
            disabled={fetchStatus === fetchConstants.FETCH_ONGOING}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <br />
          <Link to="/user/signup">
            <AppButton
              flat
              label={formatMessage(localMessages.signUpNow)}
            />
          </Link>
        </Col>
        <Col lg={12}>
          <Link to="/user/request-password-reset">
            <AppButton
              flat
              label={formatMessage(localMessages.forgotPassword)}
            />
          </Link>
        </Col>
      </Row>
    </form>
  );
};

LoginFormComponent.propTypes = {
  // from composition
  intl: React.PropTypes.object.isRequired,
  location: React.PropTypes.object,
  redirect: React.PropTypes.string,
  handleSubmit: React.PropTypes.func.isRequired,
  renderTextField: React.PropTypes.func.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  // from dispatch
  onSubmitLoginForm: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.user.fetchStatus,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSubmitLoginForm: (values) => {
    dispatch(loginWithPassword(values.email, values.password, values.destination))
    .then((response) => {
      // error reporting is handled by error reporting middleware, so you only need to handle success here
      if (response.status !== 401) {
        // redirect to destination if there is one
        const loc = ownProps.location;
        let redirect;
        if (ownProps.redirect) {
          redirect = ownProps.redirect;
        } else {
          redirect = (loc && loc.state && loc.state.nextPathname) ? loc.state.nextPathname : '';
        }
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
  if (invalidEmail(values.email)) {
    errors.email = localMessages.missingEmail;
  }
  if (emptyString(values.password)) {
    errors.password = localMessages.missingPassword;
  }
  return errors;
}

const reduxFormConfig = {
  form: 'login',
  validate,
};

export default
  injectIntl(
    composeIntlForm(
      reduxForm(reduxFormConfig)(
        connect(mapStateToProps, mapDispatchToProps)(
          LoginFormComponent
        )
      )
    )
  );
