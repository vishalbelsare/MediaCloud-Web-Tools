import React from 'react';
import Route from 'react-router/lib/Route';
import LoginFormContainer from '../components/user/LoginFormContainer';
import SignupForm from '../components/user/SignupForm';
import SignupSuccessMessage from '../components/user/SignupSuccessMessage';
import ChangePasswordSuccessMessage from '../components/user/ChangePasswordSuccessMessage';
import RecoverPasswordSuccessMessage from '../components/user/RecoverPasswordSuccessMessage';
import ChangePasswordForm from '../components/user/ChangePasswordForm';
import RecoverPasswordForm from '../components/user/RecoverPasswordForm';
import UserProfileContainer from '../components/user/UserProfileContainer';
import store from '../store';
import { logout } from '../actions/userActions';

// Lets us have a fake '/logout' route
function onEnterLogout(nextState, replaceState) {
  store.dispatch(logout());
  replaceState('/login');
}

const userRoutes = (
  <Route path="/user" >
    <Route path="profile" component={UserProfileContainer} />
    <Route path="/login" component={LoginFormContainer} />
    <Route path="/logout" onEnter={onEnterLogout} />
    <Route path="/signup" component={SignupForm} />
    <Route path="/recover" component={RecoverPasswordForm} />
    <Route path="/change-password" component={ChangePasswordForm} />
    <Route path="/signup-success" component={SignupSuccessMessage} />
    <Route path="/change-password-success" component={ChangePasswordSuccessMessage} />
    <Route path="/recover-password-success" component={RecoverPasswordSuccessMessage} />
  </Route>
);

export default userRoutes;
