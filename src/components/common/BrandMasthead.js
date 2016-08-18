import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { injectIntl } from 'react-intl';
import RaisedButton from 'material-ui/RaisedButton';
import { push } from 'react-router-redux';
import messages from '../../resources/messages';

const localMessages = {
  goHome: { id: 'brand.goHome', defaultMessage: 'go home' },
};

class BrandMasthead extends React.Component {

  onRouteToLogout = () => {
    this.context.router.push('/logout');
  }

  onRouteToLogin = () => {
    this.context.router.push('/logout');
  }

  render() {
    const { user, name, description, backgroundColor, mastheadText, navigateToHome } = this.props;
    const { formatMessage } = this.props.intl;
    const styles = {
      root: {
        backgroundColor,
      },
      right: {
        float: 'right',
      },
      clear: {
        clear: 'both',
      },
    };
    let loginLogoutButton = null;
    if (user.isLoggedIn) {
      loginLogoutButton = <RaisedButton label={formatMessage(messages.userLogout)} onTouchTap={this.onRouteToLogout} />;
    } else {
      loginLogoutButton = <RaisedButton label={formatMessage(messages.userLogin)} onTouchTap={this.onRouteToLogin} />;
    }
    const createMastheadText = () => ({ __html: (mastheadText !== null) ? mastheadText : name });
    return (
      <div id="branding-masthead" style={styles.root} >
        <Grid>
          <Row>
            <Col lg={6} md={6} sm={6}>
              <h1>
                <a href={`#${formatMessage(localMessages.goHome)}`} onClick={navigateToHome}>
                  <img alt={formatMessage(messages.suiteName)} src={'/static/img/mediacloud-logo-white-2x.png'} width={65} height={65} />
                </a>
                <strong dangerouslySetInnerHTML={createMastheadText()} />
              </h1>
            </Col>
            <Col lg={6} md={6} sm={6}>
              <div style={styles.right} >
                <small>{description}</small>
              </div>
              <div style={styles.clear} />
              <div style={styles.right} >
                {loginLogoutButton}
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }

}

BrandMasthead.propTypes = {
  // from parent
  name: React.PropTypes.string.isRequired,
  description: React.PropTypes.string.isRequired,
  backgroundColor: React.PropTypes.string.isRequired,
  lightColor: React.PropTypes.string.isRequired,
  // from context
  intl: React.PropTypes.object.isRequired,
  // state
  user: React.PropTypes.object.isRequired,
  mastheadText: React.PropTypes.string,
  // from dispatch
  navigateToHome: React.PropTypes.func.isRequired,
};

BrandMasthead.contextTypes = {
  router: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  mastheadText: state.app.mastheadText,
});

const mapDispatchToProps = (dispatch) => ({
  navigateToHome: (event) => {
    event.preventDefault();
    dispatch(push('/home'));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      BrandMasthead
    )
  );
