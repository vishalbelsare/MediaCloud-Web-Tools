import React from 'react';
import App from './components/App';
import LoginFormContainer from './components/user/LoginFormContainer';
import TopicListContainer from './components/topic/TopicListContainer';
import TopicSummaryContainer from './components/topic/summary/TopicSummaryContainer';
import { hasCookies } from './lib/auth';
import { logout } from './actions/userActions';
import store from './store';
import { Route } from 'react-router';

// We need to restrict some routes to only users that are logged in
function requireAuth(nextState, replace) {
  if (!hasCookies()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname },
    });
  }
}

// Lets us have a fake '/logout' route
function onEnterLogout(nextState, replaceState) {
  store.dispatch(logout());
  replaceState('/login');
}

const routes = (
  <Route path="/" component={App}>
    <Route path="/topics" component={TopicListContainer} onEnter={requireAuth} />
    <Route path="/topic/:topicId" component={TopicSummaryContainer} onEnter={requireAuth} />
    <Route path="/login" component={LoginFormContainer} />
    <Route path="/logout" onEnter={onEnterLogout} />
  </Route>
);

export default routes;
