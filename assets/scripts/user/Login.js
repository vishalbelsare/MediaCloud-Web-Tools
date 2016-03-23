import React from 'react';
import { connect } from 'react-redux';
import Title from 'react-title-component';
import { FormattedMessage, injectIntl } from 'react-intl';

import LoginForm from './LoginForm';

const messages = {
  loginTitle: { id: 'login.title', defaultMessage: 'login' }
};

class LoginContainer extends React.Component {
  componentDidMount() {
    if (this.props.isLoggedIn) {
      this.context.router.push('/home');
    }
  }
  render() {
    const { formatMessage } = this.props.intl;
    const titleHandler = parentTitle => `${formatMessage(messages.loginTitle)} | ${parentTitle}`;
    return (
      <div>
        <Title render={titleHandler} />
        <h2><FormattedMessage {...messages.loginTitle} /></h2>
        <LoginForm location={this.props.location} />
      </div>
    );
  }
}

LoginContainer.propTypes = {
  isLoggedIn: React.PropTypes.bool.isRequired,
  location: React.PropTypes.object.isRequired,
  intl: React.PropTypes.object.isRequired
};

LoginContainer.contextTypes = {
  router: React.PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  isLoggedIn: state.user.isLoggedIn
});

export default injectIntl(connect(
  mapStateToProps,
  null
)(LoginContainer));
