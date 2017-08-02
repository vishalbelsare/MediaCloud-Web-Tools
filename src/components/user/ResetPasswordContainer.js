import PropTypes from 'prop-types';
import React from 'react';
import { Grid } from 'react-flexbox-grid/lib';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { sendPasswordReset } from '../../actions/userActions';
import ChangePasswordForm from './ChangePasswordForm';
import { addNotice } from '../../actions/appActions';
import { LEVEL_ERROR } from '../common/Notice';

const localMessages = {
  tite: { id: 'user.resetPassword.title', defaultMessage: 'Reset Your Password' },
  button: { id: 'user.resetPassword.button', defaultMessage: 'Reset Your Password' },
  failed: { id: 'user.resetPassword.failed', defaultMessage: 'Sorry, something went wrong.' },
  badToken: { id: 'user.resetPassword.badToken', defaultMessage: 'That is an invalid reset token. Check to see if you have a newer link from us in your email.' },
};

const ResetPasswordContainer = (props) => {
  const { handlePasswordReset } = props;
  return (
    <Grid>
      <ChangePasswordForm
        titleMsg={localMessages.tite}
        buttonMsg={localMessages.button}
        onSubmit={handlePasswordReset}
      />
    </Grid>
  );
};

ResetPasswordContainer.propTypes = {
  // form router
  location: PropTypes.object.isRequired,
  // from dispatch
  handlePasswordReset: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  handlePasswordReset: (values) => {
    const email = ownProps.location.query.email;
    const passwordResetToken = ownProps.location.query.password_reset_token;
    dispatch(sendPasswordReset({ ...values, email, password_reset_token: passwordResetToken }))
    .then((response) => {
      if (response.success) {
        if (response.success === 1) {
          dispatch(push('/user/reset-password-success'));
        } else {
          dispatch(addNotice({ message: localMessages.failed, level: LEVEL_ERROR }));
        }
      } else if (response.message.includes('Password reset token is invalid')) {
        dispatch(addNotice({ message: localMessages.badToken, level: LEVEL_ERROR }));
      }
    });
  },
});

export default
  connect(null, mapDispatchToProps)(
    ResetPasswordContainer
  );
