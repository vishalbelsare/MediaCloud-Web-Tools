import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { push } from 'react-router-redux';
import { changePassword } from '../../actions/userActions';
import AppButton from '../common/AppButton';
import messages from '../../resources/messages';
import { emptyString } from '../../lib/formValidators';
import composeIntlForm from '../common/IntlForm';
import { addNotice } from '../../actions/appActions';
import { LEVEL_ERROR } from '../common/Notice';

const localMessages = {
  missingOldPassword: { id: 'user.missingOldPassword', defaultMessage: 'You need to enter your old password.' },
  missingNewPassword: { id: 'user.missingNewPassword', defaultMessage: 'You need to enter a new password.' },
  passwordsMismatch: { id: 'user.mismatchPassword', defaultMessage: 'Passwords do not match.' },
  signUpNow: { id: 'user.signUpNow', defaultMessage: 'No account? Register now' },
  failed: { id: 'user.passwordChange.failed', defaultMessage: 'Sorry, something went wrong.' },
};

class ChangePasswordForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { allowChangePassword: false };
  }
  allowChangePassword() {
    this.setState({ allowChangePassword: true });
  }
  render() {
    const { handleSubmit, onSubmitChangePassword, pristine, submitting, renderTextField, errorMessage } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <Grid>
        <form onSubmit={handleSubmit(onSubmitChangePassword.bind(this))} className="app-form change-password-form">
          <Row>
            <Col lg={12}>
              <h1><FormattedMessage {...messages.userChangePassword} /></h1>
            </Col>
          </Row>
          <Row>
            <Col lg={5}>
              <Field
                fullWidth
                name="old_password"
                type="password"
                component={renderTextField}
                floatingLabelText={messages.userOldPassword}
              />
            </Col>
          </Row>
          <Row>
            <Col lg={5}>
              <Field
                fullWidth
                errors={errorMessage}
                name="new_password"
                type="password"
                component={renderTextField}
                floatingLabelText={messages.userNewPassword}
              />
            </Col>
          </Row>
          <Row>
            <Col lg={5}>
              <Field
                fullWidth
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
              <AppButton
                type="submit"
                label={formatMessage(messages.userChangePassword)}
                primary
                disabled={pristine || submitting}
              />
            </Col>
          </Row>
        </form>
      </Grid>
    );
  }
}

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
  pristine: React.PropTypes.bool.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  // from dispatch
  onSubmitChangePassword: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.user.fetchStatus,
  errorMessage: state.user.errorMessage,
});

const mapDispatchToProps = dispatch => ({
  onSubmitChangePassword: (values) => {
    dispatch(changePassword(values))
    .then((response) => {
      if (response.status !== 200) {
        dispatch(addNotice({ message: localMessages.failed, level: LEVEL_ERROR }));
      } else if (response.success === 1) {
        dispatch(addNotice({ message: response.error, level: LEVEL_ERROR }));
      } else {
        dispatch(push('/user/change-password-success'));
      }
    });
  },
});

// in-browser validation callback
function validate(values) {
  const errors = {};
  if (emptyString(values.old_password)) {
    errors.old_password = localMessages.missingOldPassword;
  }
  if (emptyString(values.new_password)) {
    errors.new_password = localMessages.missingNewPassword;
  }
  if ((values.new_password !== undefined && values.confirm_password !== undefined) && values.new_password !== values.confirm_password) {
    errors.confirm_password = localMessages.passwordsMismatch;
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
