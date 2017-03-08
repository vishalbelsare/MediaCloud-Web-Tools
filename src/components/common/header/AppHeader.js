import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { injectIntl } from 'react-intl';
import { push } from 'react-router-redux';
import AppToolbar from './AppToolbar';
import messages from '../../../resources/messages';
import { getBrandColors } from '../../../styles/colors';
import AppNoticesContainer from './AppNoticesContainer';

const localMessages = {
  goHome: { id: 'brand.goHome', defaultMessage: 'go home' },
};

class AppHeader extends React.Component {

  onRouteToLogout = () => {
    this.context.router.push('/logout');
  }

  onRouteToLogin = () => {
    this.context.router.push('/logout');
  }

  render() {
    const { drawer, name, subHeader, showSubHeader, description, backgroundColor, navigateToHome } = this.props;
    const { formatMessage } = this.props.intl;
    const brandColors = getBrandColors();
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
    let content;
    if (showSubHeader) {
      content = (
        <Row>
          <Col lg={2}>
            <h1>
              <a href={`#${formatMessage(localMessages.goHome)}`} onClick={navigateToHome}>
                <img className="app-logo" alt={formatMessage(messages.suiteName)} src={'/static/img/mediacloud-logo-white-2x.png'} width={65} height={65} />
              </a>
            </h1>
          </Col>
          <Col lg={8}>
            {subHeader}
          </Col>
          <Col lg={2} />
        </Row>
      );
    } else {
      content = (
        <Row>
          <Col lg={7}>
            <h1>
              <a href={`#${formatMessage(localMessages.goHome)}`} onClick={navigateToHome}>
                <img className="app-logo" alt={formatMessage(messages.suiteName)} src={'/static/img/mediacloud-logo-white-2x.png'} width={65} height={65} />
              </a>
              <strong>{name}</strong>
            </h1>
          </Col>
          <Col lg={5}>
            <div style={styles.right} >
              <small>{description}</small>
            </div>
          </Col>
        </Row>
      );
    }
    return (
      <div className="app-header">
        <AppNoticesContainer />
        <AppToolbar
          backgroundColor={brandColors.light}
          drawer={drawer}
        />
        <div style={styles.root} >
          <Grid>
            {content}
          </Grid>
        </div>
      </div>
    );
  }
}

AppHeader.propTypes = {
  // from parent
  name: React.PropTypes.string.isRequired,
  description: React.PropTypes.string.isRequired,
  backgroundColor: React.PropTypes.string.isRequired,
  lightColor: React.PropTypes.string.isRequired,
  drawer: React.PropTypes.node,
  subHeader: React.PropTypes.node,
  // from context
  intl: React.PropTypes.object.isRequired,
  // state
  showSubHeader: React.PropTypes.bool,
  // from dispatch
  navigateToHome: React.PropTypes.func.isRequired,
};

AppHeader.contextTypes = {
  router: React.PropTypes.object.isRequired,
};

const mapStateToProps = store => ({
  showSubHeader: store.app.showSubHeader,
});

const mapDispatchToProps = dispatch => ({
  navigateToHome: (event) => {
    event.preventDefault();
    dispatch(push('/home'));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      AppHeader
    )
  );
