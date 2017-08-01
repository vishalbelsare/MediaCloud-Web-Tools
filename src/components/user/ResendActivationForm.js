import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { push } from 'react-router-redux';
import { resendActivation } from '../../actions/userActions';
import AppButton from '../common/AppButton';
import { LEVEL_ERROR } from '../common/Notice';
import { addNotice } from '../../actions/appActions';
import messages from '../../resources/messages';
import { invalidEmail } from '../../lib/formValidators';
import composeIntlForm from '../common/IntlForm';

const localMessages = {
  missingEmail: { id: 'user.missingEmail', defaultMessage: 'You need to enter a valid email address.' },
  title: { id: 'user.resendActivation.title', defaultMessage: 'Didn\'t get the activation email?' },
  intro: { id: 'user.resendActivation.intro', defaultMessage: 'Sorry about that! Enter your email address again and we\'ll send you another activation email.' },
  resendActivation: { id: 'user.resendActivation.action', defaultMessage: 'Resend Activation Email' },
  failed: { id: 'user.resendActivation.failed', defaultMessage: 'Sorry, something went wrong.' },
};

const ResendActivationForm = (props) => {
  const { handleSubmit, handleFormSubmission, pristine, submitting, renderTextField } = props;
  const { formatMessage } = props.intl;
  return (
    <Grid>
      <form onSubmit={handleSubmit(handleFormSubmission.bind(this))} className="app-form resend-activation-form">
        <Row>
          <Col lg={12}>
            <h1><FormattedMessage {...localMessages.title} /></h1>
            <p><FormattedMessage {...localMessages.intro} /></p>
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
              label={formatMessage(localMessages.resendActivation)}
              primary
              disabled={pristine || submitting}
            />
          </Col>
        </Row>
      </form>
    </Grid>
  );
};

ResendActivationForm.propTypes = {
  // from composition
  intl: React.PropTypes.object.isRequired,
  location: React.PropTypes.object,
  redirect: React.PropTypes.string,
  handleSubmit: React.PropTypes.func.isRequired,
  renderTextField: React.PropTypes.func.isRequired,
  pristine: React.PropTypes.bool.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  // from state
  // from dispatch
  handleFormSubmission: React.PropTypes.func.isRequired,
};

const mapStateToProps = () => ({
});

const mapDispatchToProps = dispatch => ({
  handleFormSubmission: (values) => {
    dispatch(resendActivation(values))
    .then((response) => {
      if (response.status !== 200) {
        dispatch(addNotice({ message: localMessages.failed, level: LEVEL_ERROR }));
      } else if (response.success === 1) {
        dispatch(addNotice({ message: response.error, level: LEVEL_ERROR }));
      } else {
        dispatch(push('/#/user/resend-activation-success'));
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
  form: 'resend-activation-form',
  validate,
};

export default
  injectIntl(
    composeIntlForm(
      reduxForm(reduxFormConfig)(
        connect(mapStateToProps, mapDispatchToProps)(
          ResendActivationForm
        )
      )
    )
  );
