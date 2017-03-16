import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { push } from 'react-router-redux';
import { recoverPassword, setLoginErrorMessage } from '../../actions/userActions';
import AppButton from '../common/AppButton';
import messages from '../../resources/messages';
import { emptyString } from '../../lib/formValidators';
import composeIntlForm from '../common/IntlForm';

const localMessages = {
  missingEmail: { id: 'user.missingEmail', defaultMessage: 'You need to enter your email address.' },
  missingPassword: { id: 'user.missingPassword', defaultMessage: 'You need to enter your password.' },
  loginFailed: { id: 'user.loginFailed', defaultMessage: 'Your email or password was wrong.' },
  signUpNow: { id: 'user.signUpNow', defaultMessage: 'No account? Register now' },
};

const RecoverPasswordForm = (props) => {
  const { handleSubmit, onSubmitRecovery, pristine, renderTextField } = props;
  const { formatMessage } = props.intl;
  return (
    <Grid>
      <form onSubmit={handleSubmit(onSubmitRecovery.bind(this))} className="recover-password-form">
        <Row>
          <Col lg={12} md={12} sm={12}>
            <h2><FormattedMessage {...messages.recoverPassword} /></h2>
          </Col>
        </Row>
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
            <br />
            <AppButton
              type="submit"
              label={formatMessage(messages.recoverPassword)}
              primary
              disabled={pristine}
            />
          </Col>
        </Row>
      </form>
    </Grid>
  );
};

RecoverPasswordForm.propTypes = {
  // from composition
  intl: React.PropTypes.object.isRequired,
  location: React.PropTypes.object,
  redirect: React.PropTypes.string,
  handleSubmit: React.PropTypes.func.isRequired,
  renderTextField: React.PropTypes.func.isRequired,
  // from state
  errorMessage: React.PropTypes.string,
  pristine: React.PropTypes.bool.isRequired,
  // from dispatch
  onSubmitRecovery: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.user.fetchStatus,
  errorMessage: state.user.errorMessage,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSubmitRecovery: (values) => {
    dispatch(recoverPassword(values))
    .then((response) => {
      if (response.status === 401) {
        dispatch(setLoginErrorMessage(ownProps.intl.formatMessage(localMessages.loginFailed)));
      } else {
        // dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(localMessages.feedback) }));
        dispatch(push('/recover-password-success'));
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
  return errors;
}

const reduxFormConfig = {
  form: 'recover-password-form',
  validate,
};

export default
  injectIntl(
    composeIntlForm(
      reduxForm(reduxFormConfig)(
        connect(mapStateToProps, mapDispatchToProps)(
          RecoverPasswordForm
        )
      )
    )
  );
