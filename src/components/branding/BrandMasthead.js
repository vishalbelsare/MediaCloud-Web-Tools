import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { FormattedMessage, injectIntl } from 'react-intl';
import RaisedButton from 'material-ui/RaisedButton';
import messages from '../../resources/messages';

class BrandMasthead extends React.Component {

  onRouteToLogout = () => {
    this.context.router.push('/logout');
  }

  onRouteToLogin = () => {
    this.context.router.push('/logout');
  }

  render() {
    const { user, name, description, backgroundColor, lightColor } = this.props;
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
    return (
      <div className="branding-masthead" style={styles.root} >
        <Grid>
          <Row>
            <Col lg={8}>
              <h1>
                <a href="https://topics.mediameter.org"><img src={'/static/mediacloud-logo-green-2x.png'} width={65} height={65} /></a>
                <strong>{name}</strong>
              </h1>
            </Col>
            <Col lg={4}>
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
  user: React.PropTypes.object.isRequired,
  name: React.PropTypes.string.isRequired,
  description: React.PropTypes.string.isRequired,
  backgroundColor: React.PropTypes.string.isRequired,
  lightColor: React.PropTypes.string.isRequired,
  intl: React.PropTypes.object.isRequired,
};

BrandMasthead.contextTypes = {
  router: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default injectIntl(connect(mapStateToProps, null)(BrandMasthead));
