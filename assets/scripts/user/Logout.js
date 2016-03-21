import React from 'react';
import { logout } from './userActions';

class Logout extends React.Component {
  componentDidMount() {
    this.context.store.dispatch(logout(this.context.router));
  }
  render() {
    return (
      <p>You have been logged out, you will be redirected shortly to login...</p>
    );
  }
}

Logout.contextTypes = {
  router: React.PropTypes.object.isRequired,
  store: React.PropTypes.object.isRequired
};

export default Logout;
