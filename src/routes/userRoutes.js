import React from 'react';
import Route from 'react-router/lib/Route';
import { requireAuth, redirectHomeIfLoggedIn } from './routes';
import LoginFormContainer from '../components/user/LoginFormContainer';
import SignupForm from '../components/user/SignupForm';
import SignupSuccessMessage from '../components/user/SignupSuccessMessage';
import ChangePasswordSuccessMessage from '../components/user/ChangePasswordSuccessMessage';
import RecoverPasswordSuccessMessage from '../components/user/RecoverPasswordSuccessMessage';
import ResendActivationSuccess from '../components/user/ResendActivationSuccess';
import Activated from '../components/user/Activated';
import ChangePasswordForm from '../components/user/ChangePasswordForm';
import RecoverPasswordForm from '../components/user/RecoverPasswordForm';
import UserProfileContainer from '../components/user/UserProfileContainer';
import ResendActivationForm from '../components/user/ResendActivationForm';
import store from '../store';
import { logout } from '../actions/userActions';

// Lets us have a fake '/logout' route
function onEnterLogout(nextState, replaceState) {
  store.dispatch(logout());
  replaceState('/home');
}

const userRoutes = (
  <Route path="/user" >

    <Route path="/login" component={LoginFormContainer} onEnter={redirectHomeIfLoggedIn} />
    <Route path="/logout" onEnter={onEnterLogout} />

    <Route path="profile" component={UserProfileContainer} onEnter={requireAuth} />

    <Route path="signup" component={SignupForm} onEnter={redirectHomeIfLoggedIn} />
    <Route path="signup-success" component={SignupSuccessMessage} onEnter={redirectHomeIfLoggedIn} />
    <Route path="resend-activation" component={ResendActivationForm} onEnter={redirectHomeIfLoggedIn} />
    <Route path="resend-activation-success" component={ResendActivationSuccess} onEnter={redirectHomeIfLoggedIn} />
    <Route path="activated" component={Activated} onEnter={redirectHomeIfLoggedIn} />

    <Route path="recover-password" component={RecoverPasswordForm} onEnter={redirectHomeIfLoggedIn} />
    <Route path="recover-password-success" component={RecoverPasswordSuccessMessage} onEnter={redirectHomeIfLoggedIn} />

    <Route path="change-password" component={ChangePasswordForm} onEnter={requireAuth} />
    <Route path="change-password-success" component={ChangePasswordSuccessMessage} onEnter={requireAuth} />

  </Route>
);

export default userRoutes;
