import React from 'react';
import { logout } from './userActions';
import {FormattedMessage} from 'react-intl';

class Logout extends React.Component {
  componentDidMount() {
    this.context.store.dispatch(logout(this.context.router));
  }
  render() {
    return (
      <p><FormattedMessage id="logout.success" 
          defaultMessage="You have been logged out, you will be redirected shortly to login..."/>
      </p>
    );
  }
}

Logout.contextTypes = {
  router: React.PropTypes.object.isRequired,
  store: React.PropTypes.object.isRequired
};

export default Logout;
