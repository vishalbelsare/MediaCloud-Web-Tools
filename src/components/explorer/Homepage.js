import React from 'react';
import { injectIntl, FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import Link from 'react-router/lib/Link';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import ItemSlider from '../../common/ItemSlider';
import DataCard from '../../common/DataCard';
import LoginForm from '../../user/LoginForm';
import FeaturedQueriesContainer from './FeaturedQueriesContainer';

const localMessages = {
  title: { id: 'explorer.intro.title', defaultMessage: 'Explorer' },
  about: { id: 'explorer.intro.about', defaultMessage: 'Explorer Text' },
  loginTitle: { id: 'explorer.intro.login.title', defaultMessage: 'Have an Account? Login Now' },
};

const Homepage = (props) => {
  const { goToUrl, user } = props;
  const { formatMessage } = props.intl;
  let sideBarContent;
  const dummyQuery = { 'id': 1, 'label':'something'};
  const dummyQuery2 = { 'id': 2, 'label':'something else'}
  const fixedQuerySlides = (
    <div key={1}><FeaturedItem query={dummyQuery} /></div>
    <div key={2}><FeaturedItem query={dummyQuery2} /></div>
    <div key={3}><FeaturedItem query={dummyQuery} /></div>
  );
  if (!user.isLoggedIn) {
    sideBarContent = (
      <DataCard>
        <h2><FormattedMessage {...localMessages.loginTitle} /></h2>
        <LoginForm />
      </DataCard>
    );
  }
  return (
    <Grid>
      <Row>
        <Col lg={12}>
          <h1>
            <FormattedMessage {...localMessages.title} />
          </h1>
          <p>
            <FormattedHTMLMessage {...localMessages.about} />
          </p>
        </Col>
      </Row>
      <Row>
        <Col lg={7} xs={12}>
          <FeaturedQueriesContainer />
        </Col>
      </Row>
    </Grid>
  );
};

Homepage.propTypes = {
  intl: React.PropTypes.object.isRequired,
  // from context
  location: React.PropTypes.object.isRequired,
  params: React.PropTypes.object.isRequired,       // params from router
  // from state
  user: React.PropTypes.object.isRequired,
  // from dispatch
  goToUrl: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  goToUrl: (url) => {
    dispatch(push(url));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      Homepage
    )
  );
