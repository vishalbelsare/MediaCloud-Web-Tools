import React from 'react';
import { connect } from 'react-redux';
import Title from 'react-title-component';
import { FormattedMessage, injectIntl } from 'react-intl';
import LoginForm from './LoginForm';

const localMessages = {
  loginTitle: { id: 'login.title', defaultMessage: 'login' },
};

class LoginContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.isLoggedIn) {
      this.context.router.push('/topics');
    }
  }
  render() {
    const { formatMessage } = this.props.intl;
    const titleHandler = parentTitle => `${formatMessage(localMessages.loginTitle)} | ${parentTitle}`;
    return (
      <div>
        <Title render={titleHandler} />
        <h2><FormattedMessage {...localMessages.loginTitle} /></h2>
        <LoginForm location={this.props.location} />
      </div>
    );
  }
}

LoginContainer.propTypes = {
  isLoggedIn: React.PropTypes.bool.isRequired,
  location: React.PropTypes.object.isRequired,
  intl: React.PropTypes.object.isRequired,
};

LoginContainer.contextTypes = {
  router: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  isLoggedIn: state.user.isLoggedIn,
});

export default injectIntl(connect(
  mapStateToProps,
  null
)(LoginContainer));
