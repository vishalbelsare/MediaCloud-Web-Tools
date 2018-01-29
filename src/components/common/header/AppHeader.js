import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { injectIntl } from 'react-intl';
import { push } from 'react-router-redux';
import NavToolbar from './NavToolbar';
import messages from '../../../resources/messages';
import { getBrandColors } from '../../../styles/colors';
import AppNoticesContainer from './AppNoticesContainer';
import { assetUrl } from '../../../lib/assetUtil';

const localMessages = {
  goHome: { id: 'brand.goHome', defaultMessage: 'go home' },
};

const AppHeader = (props) => {
  const { drawer, name, subHeader, showSubHeader, description, backgroundColor, navigateToHome } = props;
  const { formatMessage } = props.intl;
  const brandColors = getBrandColors();
  const styles = {
    root: {
      backgroundColor,
    },
    right: {
      float: 'right',
    },
  };
  let content;
  if (showSubHeader) {
    content = (
      <Row>
        <Col lg={2}>
          <h1>
            <a href={`#${formatMessage(localMessages.goHome)}`} onClick={navigateToHome}>
              <img
                className="app-logo"
                alt={formatMessage(messages.suiteName)}
                src={assetUrl('/static/img/mediacloud-logo-white-2x.png')}
                width={65}
                height={65}
              />
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
              <img
                className="app-logo"
                alt={formatMessage(messages.suiteName)}
                src={assetUrl('/static/img/mediacloud-logo-white-2x.png')}
                width={65}
                height={65}
              />
            </a>
            <strong>{name}</strong>
          </h1>
        </Col>
        <Col lg={5}>
          <div style={styles.right} >
            <small className="app-description">{description}</small>
          </div>
        </Col>
      </Row>
    );
  }
  return (
    <div className="app-header">
      <AppNoticesContainer />
      <NavToolbar
        backgroundColor={brandColors.dark}
        drawer={drawer}
      />
      <div style={styles.root} >
        <Grid>
          {content}
        </Grid>
      </div>
    </div>
  );
};

AppHeader.propTypes = {
  // from parent
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string.isRequired,
  lightColor: PropTypes.string.isRequired,
  drawer: PropTypes.node,
  subHeader: PropTypes.node,
  // from context
  intl: PropTypes.object.isRequired,
  // state
  showSubHeader: PropTypes.bool,
  // from dispatch
  navigateToHome: PropTypes.func.isRequired,
};

AppHeader.contextTypes = {
  router: PropTypes.object.isRequired,
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
