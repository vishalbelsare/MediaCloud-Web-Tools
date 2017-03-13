import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Row, Col } from 'react-flexbox-grid/lib';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { push } from 'react-router-redux';
import Recaptcha from 'react-recaptcha';
import { changePassword, setLoginErrorMessage } from '../../actions/userActions';
import AppButton from '../common/AppButton';
import * as fetchConstants from '../../lib/fetchConstants';
import messages from '../../resources/messages';
import { emptyString } from '../../lib/formValidators';
import composeIntlForm from '../common/IntlForm';

const localMessages = {
  missingOldPassword: { id: 'user.missingOldPassword', defaultMessage: 'You need to enter your old password.' },
  missingNewPassword: { id: 'user.missingNewPassword', defaultMessage: 'You need to enter a new password.' },
  signUpNow: { id: 'user.signUpNow', defaultMessage: 'No account? Register now' },
};

const ChangePasswordForm = (props) => {
  const { handleSubmit, onSubmitLoginForm, fetchStatus, renderTextField } = props;
  const { formatMessage } = props.intl;
  return (
    <form onSubmit={handleSubmit(onSubmitLoginForm.bind(this))} className="change-password-form">
      <Row>
        <Col lg={12}>
          <Field
            name="old_password"
            type="password"
            component={renderTextField}
            floatingLabelText={messages.userOldPassword}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <Field
            name="new_password"
            type="password"
            component={renderTextField}
            floatingLabelText={messages.userNewPassword}
          />
        </Col>
      </Row>
      <Recaptcha
        sitekey="6Le8zhgUAAAAANfXdzoR0EFXNcjZnVTRhIh6JVnG"
      />
      <Row>
        <Col lg={12}>
          <br />
          <AppButton
            type="submit"
            label={formatMessage(messages.changePassword)}
            primary
            disabled={fetchStatus === fetchConstants.FETCH_ONGOING}
          />
        </Col>
      </Row>
    </form>
  );
};

ChangePasswordForm.propTypes = {
  // from composition
  intl: React.PropTypes.object.isRequired,
  location: React.PropTypes.object,
  redirect: React.PropTypes.string,
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
    dispatch(changePassword(values))
    .then((response) => {
      if (response.status === 401) {
        dispatch(setLoginErrorMessage(ownProps.intl.formatMessage(localMessages.loginFailed)));
      } else {
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
  if (emptyString(values.old_password)) {
    errors.email = localMessages.missingOldPassword;
  }
  if (emptyString(values.new_password)) {
    errors.password = localMessages.missingNewPassword;
  }
  return errors;
}

const reduxFormConfig = {
  form: 'change-password-form',
  validate,
};

export default
  injectIntl(
    composeIntlForm(
      reduxForm(reduxFormConfig)(
        connect(mapStateToProps, mapDispatchToProps)(
          ChangePasswordForm
        )
      )
    )
  );
