import React from 'react';
import { injectIntl, FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { connect } from 'react-redux';
import Link from 'react-router/lib/Link';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import FeaturedCollectionsContainer from './FeaturedCollectionsContainer';
import PopularCollectionsContainer from './PopularCollectionsContainer';
import FavoriteSourcesAndCollectionsContainer from './FavoriteSourcesAndCollectionsContainer';
import DataCard from '../../common/DataCard';
import LoginForm from '../../user/LoginForm';

const localMessages = {
  title: { id: 'sources.intro.title', defaultMessage: 'Explore our Sources and Collections' },
  about: { id: 'sources.intro.about', defaultMessage: 'We add sources and create collections from media ecosystems around the world. In order to identify the right sources, we use a combination of automated search and discovery, identified lists of influential sources, and expert input from journalists and media practitioners. You can also ' },
  suggestLink: { id: 'sources.intro.suggestLink', defaultMessage: 'suggest a source.' },
  browse: { id: 'sources.intro.browse', defaultMessage: 'Browse by Category' },
  created: { id: 'sources.intro.created', defaultMessage: "Collections I've created" },
  loginTitle: { id: 'sources.intro.login.title', defaultMessage: 'Have an Account? Login Now' },
};

const Homepage = (props) => {
  let sideBarContent;
  if (props.user.isLoggedIn) {
    sideBarContent = <FavoriteSourcesAndCollectionsContainer />;
  } else {
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
            <Link to={'/sources/suggest'}><FormattedMessage {...localMessages.suggestLink} /></Link>
          </p>
        </Col>
      </Row>
      <Row>
        <Col lg={7} xs={12}>
          <FeaturedCollectionsContainer />
        </Col>
        <Col lg={5} xs={12}>
          {sideBarContent}
        </Col>
      </Row>
      <Row>
        <Col lg={12} xs={12}>
          <PopularCollectionsContainer title={localMessages.browse} />
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
};

const mapStateToProps = state => ({
  user: state.user,
});

export default
  injectIntl(
    connect(mapStateToProps)(
      Homepage
    )
  );
