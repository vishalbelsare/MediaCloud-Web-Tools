import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Row, Col } from 'react-flexbox-grid/lib';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { push } from 'react-router-redux';
import { loginWithPassword, setLoginErrorMessage } from '../../actions/userActions';
import AppButton from '../common/AppButton';
import { getAppName } from '../../config';
import * as fetchConstants from '../../lib/fetchConstants';
import messages from '../../resources/messages';
import { notEmptyString } from '../../lib/formValidators';
import composeIntlForm from '../common/IntlForm';

const MEDIACLOUD_REGISTER_URL = 'https://core.mediacloud.org/login/register';

const localMessages = {
  missingEmail: { id: 'user.missingEmail', defaultMessage: 'You need to enter your email address.' },
  missingPassword: { id: 'user.missingPassword', defaultMessage: 'You need to enter your password.' },
  loginFailed: { id: 'user.loginFailed', defaultMessage: 'Your email or password was wrong.' },
  signUpNow: { id: 'user.signUpNow', defaultMessage: 'No account? Register now' },
};

const LoginFormComponent = (props) => {
  const { handleSubmit, onSubmitLoginForm, fetchStatus, renderTextField } = props;
  const { formatMessage } = props.intl;
  return (
    <form onSubmit={handleSubmit(onSubmitLoginForm.bind(this))} className="login-form">
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
          <a href={`${MEDIACLOUD_REGISTER_URL}?from=${getAppName()}`}>
            <AppButton
              flat
              label={formatMessage(localMessages.signUpNow)}
            />
          </a>
        </Col>
      </Row>
    </form>
  );
};

LoginFormComponent.propTypes = {
  // from composition
  intl: React.PropTypes.object.isRequired,
  location: React.PropTypes.object.isRequired,
  handleSubmit: React.PropTypes.func.isRequired,
  renderTextField: React.PropTypes.func.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  errorMessage: React.PropTypes.string,
  // from dispatch
  onSubmitLoginForm: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.user.fetchStatus,
  errorMessage: state.user.errorMessage,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSubmitLoginForm: (values) => {
    dispatch(loginWithPassword(values.email, values.password, values.destination))
    .then((response) => {
      if (response.status === 401) {
        dispatch(setLoginErrorMessage(ownProps.intl.formatMessage(localMessages.loginFailed)));
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
    errors.email = localMessages.missingEmail;
  }
  if (!notEmptyString(values.password)) {
    errors.password = localMessages.missingPassword;
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
    composeIntlForm(
      reduxForm(reduxFormConfig)(
        connect(mapStateToProps, mapDispatchToProps)(
          LoginFormComponent
        )
      )
    )
  );
