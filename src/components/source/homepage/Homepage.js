import React from 'react';
import { injectIntl, FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import Link from 'react-router/lib/Link';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import FeaturedCollectionsContainer from './FeaturedCollectionsContainer';
import PopularCollectionsContainer from './PopularCollectionsContainer';
import FavoriteSourcesAndCollectionsContainer from './FavoriteSourcesAndCollectionsContainer';
import AppButton from '../../common/AppButton';
import DataCard from '../../common/DataCard';
import LoginForm from '../../user/LoginForm';

const localMessages = {
  title: { id: 'sources.intro.title', defaultMessage: 'Explore our Sources and Collections' },
  about: { id: 'sources.intro.about', defaultMessage: 'We add sources and create collections from media ecosystems around the world. In order to identify the right sources, we use a combination of automated search and discovery, identified lists of influential sources, and expert input from journalists and media practitioners. You can also ' },
  suggestLink: { id: 'sources.intro.suggestLink', defaultMessage: 'suggest a source.' },
  browseMediaCloud: { id: 'sources.into.browse.mediacloud', defaultMessage: 'Browse Media Cloud Collections' },
  browseGlobalVoices: { id: 'sources.into.browse.mediacloud', defaultMessage: 'Browse Global Voices Collections' },
  browseEMM: { id: 'sources.into.browse.mediacloud', defaultMessage: 'Browse European Media Monitor Collections' },
  created: { id: 'sources.intro.created', defaultMessage: "Collections I've created" },
  loginTitle: { id: 'sources.intro.login.title', defaultMessage: 'Have an Account? Login Now' },
};

const Homepage = (props) => {
  const { goToUrl, user } = props;
  const { formatMessage } = props.intl;
  let sideBarContent;
  if (user.isLoggedIn) {
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
      <Row center="lg">
        <Col lg={4} xs={12}>
          <AppButton
            primary
            label={formatMessage(localMessages.browseMediaCloud)}
            onClick={() => { goToUrl('/collectons/media-cloud'); }}
          />
        </Col>
        <Col lg={4} xs={12}>
          <AppButton
            primary
            label={formatMessage(localMessages.browseGlobalVoices)}
            onClick={() => { goToUrl('/collectons/global-voices'); }}
          />
        </Col>
        <Col lg={4} xs={12}>
          <AppButton
            primary
            label={formatMessage(localMessages.browseEMM)}
            onClick={() => { goToUrl('/collectons/european-media-monitor'); }}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={12} xs={12}>
          <PopularCollectionsContainer />
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
