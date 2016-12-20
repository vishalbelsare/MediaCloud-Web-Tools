import React from 'react';
import Route from 'react-router/lib/Route';
import LoginFormContainer from '../components/user/LoginFormContainer';
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
  </Route>
);

export default userRoutes;
