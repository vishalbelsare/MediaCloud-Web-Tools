import React from 'react';
import Route from 'react-router/lib/Route';
import { requireAuth, redirectHomeIfLoggedIn } from './routes';
import LoginFormContainer from '../components/user/LoginFormContainer';
import SignupContainer from '../components/user/SignupContainer';
import SignupSuccessMessage from '../components/user/SignupSuccessMessage';
import ChangePasswordSuccessMessage from '../components/user/ChangePasswordSuccessMessage';
import RequestPasswordResetSuccessMessage from '../components/user/RequestPasswordResetSuccessMessage';
import ResendActivationSuccess from '../components/user/ResendActivationSuccess';
import Activated from '../components/user/Activated';
import ChangePasswordContainer from '../components/user/ChangePasswordContainer';
import RequestPasswordReset from '../components/user/RequestPasswordReset';
import ResetPasswordContainer from '../components/user/ResetPasswordContainer';
import ResetPasswordSuccessMessage from '../components/user/ResetPasswordSuccessMessage';
import UserProfileContainer from '../components/user/UserProfileContainer';
import ResendActivationForm from '../components/user/ResendActivationForm';
import store from '../store';
import { logout } from '../actions/userActions';

// Lets us have a fake '/logout' route
function onEnterLogout(nextState, replaceState) {
  store.dispatch(logout());
  replaceState('/home');
}

function ensureEmailAndTokenOnUrl(nextState, replaceState) {
  const redirectedHome = redirectHomeIfLoggedIn(nextState, replaceState);
  if (!redirectedHome) {
    // make sure email and token are on url
    const query = nextState.location.query;
    if (!(query.email && query.password_reset_token)) {
      replaceState('/home');
    }
  }
}

const userRoutes = (
  <Route path="/user" >

    <Route path="/login" component={LoginFormContainer} onEnter={redirectHomeIfLoggedIn} />
    <Route path="/logout" onEnter={onEnterLogout} />

    <Route path="profile" component={UserProfileContainer} onEnter={requireAuth} />

    <Route path="signup" component={SignupContainer} onEnter={redirectHomeIfLoggedIn} />
    <Route path="signup-success" component={SignupSuccessMessage} onEnter={redirectHomeIfLoggedIn} />
    <Route path="resend-activation" component={ResendActivationForm} onEnter={redirectHomeIfLoggedIn} />
    <Route path="resend-activation-success" component={ResendActivationSuccess} onEnter={redirectHomeIfLoggedIn} />
    <Route path="activated" component={Activated} onEnter={redirectHomeIfLoggedIn} />

    <Route path="request-password-reset" component={RequestPasswordReset} onEnter={redirectHomeIfLoggedIn} />
    <Route path="request-password-reset-success" component={RequestPasswordResetSuccessMessage} onEnter={redirectHomeIfLoggedIn} />
    <Route path="reset-password" component={ResetPasswordContainer} onEnter={ensureEmailAndTokenOnUrl} />
    <Route path="reset-password-success" component={ResetPasswordSuccessMessage} />

    <Route path="change-password" component={ChangePasswordContainer} onEnter={requireAuth} />
    <Route path="change-password-success" component={ChangePasswordSuccessMessage} onEnter={requireAuth} />

  </Route>
);

export default userRoutes;
