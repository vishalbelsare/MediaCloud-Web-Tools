import React from 'react';
import { logout } from './userActions';

const Logout = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired,
    store: React.PropTypes.object.isRequired
  },
  componentDidMount() {
    this.context.store.dispatch(logout(this.context.router));
  },
  render() {
    return (
      <p>You have been logged out, you will be redirected shortly to login...</p>
    );
  }
});

export default Logout;
