import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { push } from 'react-router-redux';
import { LEVEL_ERROR } from '../common/Notice';
import { recoverPassword } from '../../actions/userActions';
import { addNotice } from '../../actions/appActions';
import AppButton from '../common/AppButton';
import messages from '../../resources/messages';
import { invalidEmail } from '../../lib/formValidators';
import composeIntlForm from '../common/IntlForm';

const localMessages = {
  missingEmail: { id: 'user.missingEmail', defaultMessage: 'You need to enter a valid email address.' },
  failed: { id: 'user.recoverPassword.failed', defaultMessage: 'Sorry, something went wrong.' },
};

const RecoverPasswordForm = (props) => {
  const { handleSubmit, onSubmitRecovery, pristine, renderTextField } = props;
  const { formatMessage } = props.intl;
  return (
    <Grid>
      <form onSubmit={handleSubmit(onSubmitRecovery.bind(this))} className="app-form recover-password-form">
        <Row>
          <Col lg={12}>
            <h1><FormattedMessage {...messages.userRecoverPassword} /></h1>
          </Col>
        </Row>
        <Row>
          <Col lg={8} xs={12}>
            <Field
              fullWidth
              name="email"
              component={renderTextField}
              floatingLabelText={messages.userEmail}
            />
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <AppButton
              type="submit"
              label={formatMessage(messages.userRecoverPassword)}
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

const mapDispatchToProps = dispatch => ({
  onSubmitRecovery: (values) => {
    dispatch(recoverPassword(values))
    .then((response) => {
      if (response.status !== 200) {
        dispatch(addNotice({ message: localMessages.failed, level: LEVEL_ERROR }));
      } else if (response.success === 1) {
        dispatch(addNotice({ message: response.error, level: LEVEL_ERROR }));
      } else {
        dispatch(push('/user/recover-password-success'));
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
