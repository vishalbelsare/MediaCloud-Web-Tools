import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import FeaturedCollectionsContainer from '../collection/FeaturedCollectionsContainer';
import PopularCollectionsContainer from '../collection/PopularCollectionsContainer';
import FavoriteSourcesAndCollectionsContainer from '../collection/FavoriteSourcesAndCollectionsContainer';

const localMessages = {
  title: { id: 'sources.intro.title', defaultMessage: 'Explore our Sources and Collections' },
  about: { id: 'sources.intro.about', defaultMessage: 'Explore the featured collections below, or your favorited sources and collections to the left.' },
  browse: { id: 'sources.intro.browse', defaultMessage: 'Browse by Category' },
  created: { id: 'sources.intro.created', defaultMessage: "Collections I've created" },
};

const SourceManagerContainer = () => (
  <Grid>
    <Row>
      <Col lg={8} xs={12}>
        <h1>
          <FormattedMessage {...localMessages.title} />
        </h1>
        <h2><FormattedMessage {...localMessages.about} /></h2>
      </Col>
    </Row>
    <Row>
      <Col lg={8} xs={12}>
        <FeaturedCollectionsContainer />
      </Col>
      <Col lg={4} xs={12}>
        <FavoriteSourcesAndCollectionsContainer />
      </Col>
    </Row>
    <Row>
      <Col lg={12} xs={12}>
        <PopularCollectionsContainer title={localMessages.browse} />
      </Col>
    </Row>
  </Grid>
);

SourceManagerContainer.propTypes = {
  intl: React.PropTypes.object.isRequired,
  // from context
  location: React.PropTypes.object.isRequired,
  params: React.PropTypes.object.isRequired,       // params from router
  // from state
};

export default
  injectIntl(
    connect()(
      SourceManagerContainer
    ),
  );
