import React from 'react';
import { Grid } from 'react-flexbox-grid/lib';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { changePassword } from '../../actions/userActions';
import ChangePasswordForm from './ChangePasswordForm';
import { addNotice } from '../../actions/appActions';
import { LEVEL_ERROR } from '../common/Notice';
import messages from '../../resources/messages';

const localMessages = {
  missingOldPassword: { id: 'user.missingOldPassword', defaultMessage: 'You need to enter your old password.' },
  missingNewPassword: { id: 'user.missingNewPassword', defaultMessage: 'You need to enter a new password.' },
  passwordsMismatch: { id: 'user.mismatchPassword', defaultMessage: 'Passwords do not match.' },
  failed: { id: 'user.passwordChange.failed', defaultMessage: 'Sorry, something went wrong.' },
};

const ChangePasswordContainer = (props) => {
  const { handlePasswordChange } = props;
  return (
    <Grid>
      <ChangePasswordForm
        titleMsg={messages.userChangePassword}
        buttonMsg={messages.userChangePassword}
        showOldPassword
        onSubmit={handlePasswordChange}
      />
    </Grid>
  );
};

ChangePasswordContainer.propTypes = {
  // from dispatch
  handlePasswordChange: React.PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  handlePasswordChange: (values) => {
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

export default
  connect(null, mapDispatchToProps)(
    ChangePasswordContainer
  );
