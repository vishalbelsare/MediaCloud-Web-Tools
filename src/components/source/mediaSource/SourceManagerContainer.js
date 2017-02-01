import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import Link from 'react-router/lib/Link';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import FavoritedList from '../../common/FavoritedList';
import FeaturedCollectionsContainer from '../collection/FeaturedCollectionsContainer';
import PopularCollectionsContainer from '../collection/PopularCollectionsContainer';
import { fetchFavoriteCollections, fetchFavoriteSources } from '../../../actions/sourceActions';
import composeAsyncContainer from '../../common/AsyncContainer';
import messages from '../../../resources/messages';
import { ExploreButton } from '../../common/IconButton';

const localMessages = {
  title: { id: 'sources.intro.title', defaultMessage: 'Explore our Sources and Collections' },
  about: { id: 'sources.intro.about', defaultMessage: 'something something. Explore the featured collections below, or your favorited sources and collections to the left.' },
  browse: { id: 'sources.intro.browse', defaultMessage: 'Browse by Category' },
  personal: { id: 'sources.intro.personal', defaultMessage: 'My Sources and Collections' },
  created: { id: 'sources.intro.created', defaultMessage: "Collections I've created" },
};

const SourceManagerContainer = (props) => {
  const { favoritedSources, favoritedCollections } = props;
  const { formatMessage } = props.intl;
  let myFavorites = null;
  if (favoritedSources) {
    myFavorites = (
      <div>
        <h1>
          <FormattedMessage {...localMessages.personal} />
        </h1>
        <Link to={'favorited'}>
          <FormattedMessage {...messages.exploreFavorites} />
        </Link>
        &nbsp;
        <ExploreButton linkTo={'favorited'} />
        <FavoritedList
          title={formatMessage(messages.favoritedSourcesTitle)}
          favoritedItems={favoritedSources}
        />
        <FavoritedList
          title={formatMessage(messages.favoritedCollectionsTitle)}
          favoritedItems={favoritedCollections}
        />
      </div>
    );
  }
  return (
    <Grid>
      <Row>
        <Col lg={8} xs={12}>
          <h1>
            <FormattedMessage {...localMessages.title} />
          </h1>
          <p><FormattedMessage {...localMessages.about} /></p>
        </Col>
      </Row>
      <Row>
        <Col lg={8} xs={12}>
          <FeaturedCollectionsContainer />
        </Col>
        <Col lg={4} xs={12}>
          {myFavorites}
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


SourceManagerContainer.propTypes = {
  intl: React.PropTypes.object.isRequired,
  // from dispatch
  fetchData: React.PropTypes.func.isRequired,
  asyncFetch: React.PropTypes.func.isRequired,
  // from context
  location: React.PropTypes.object.isRequired,
  params: React.PropTypes.object.isRequired,       // params from router
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  favoritedSources: React.PropTypes.array.isRequired,
  favoritedCollections: React.PropTypes.array.isRequired,
};

SourceManagerContainer.contextTypes = {
  store: React.PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.sources.collections.favorited.fetchStatus,
  favoritedSources: state.sources.sources.favorited.list,
  favoritedCollections: state.sources.collections.favorited.list,
});


const mapDispatchToProps = dispatch => ({
  fetchData: () => {
    dispatch(fetchFavoriteCollections());
    dispatch(fetchFavoriteSources());
  },
  asyncFetch: () => {
    dispatch(fetchFavoriteCollections());
    dispatch(fetchFavoriteSources());
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeAsyncContainer(
        SourceManagerContainer
      )
    )
  );
