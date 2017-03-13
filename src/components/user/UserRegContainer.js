import React from 'react';
import { connect } from 'react-redux';
import { Grid } from 'react-flexbox-grid/lib';
import { injectIntl } from 'react-intl';
import SignupForm from './SignupForm';
import ChangePasswordForm from './ChangePasswordForm';
import RecoverPasswordForm from './RecoverPasswordForm';

class UserRegContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.isLoggedIn) {
      this.context.router.push('/home');
    }
  }
  render() {
    const { authAction } = this.props;
    let content = <ChangePasswordForm location={this.props.location} />;

    if (authAction === '/signup') {
      content = <SignupForm location={this.props.location} />;
    } else if (authAction === '/recover') {
      content = <RecoverPasswordForm location={this.props.location} />;
    }
    return (
      <Grid>
        {content}
      </Grid>
    );
  }
}

UserRegContainer.propTypes = {
  isLoggedIn: React.PropTypes.bool.isRequired,
  intl: React.PropTypes.object.isRequired,
  location: React.PropTypes.object,
  authAction: React.PropTypes.string,
};

UserRegContainer.contextTypes = {
  router: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  isLoggedIn: state.user.isLoggedIn,
  authAction: ownProps.location.pathname,
});

export default
  injectIntl(
    connect(mapStateToProps)(
      UserRegContainer
    )
  );
