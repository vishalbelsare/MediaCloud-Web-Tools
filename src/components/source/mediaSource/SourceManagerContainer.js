import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import Link from 'react-router/lib/Link';
import FavoritedList from '../../common/FavoritedList';
import { fetchFavoriteCollections, fetchFavoriteSources, fetchFeaturedCollectionList, fetchPopularCollectionList } from '../../../actions/sourceActions';
import composeAsyncContainer from '../../common/AsyncContainer';
import messages from '../../../resources/messages';

const localMessages = {
  title: { id: 'sources.intro.title', defaultMessage: 'Explore our Sources and Collections' },
  about: { id: 'sources.intro.about', defaultMessage: 'something something. Explore the featured collections below, or your favorited sources and collections to the left.' },
  browse: { id: 'sources.intro.browse', defaultMessage: 'Browse by Category' },
  personal: { id: 'sources.intro.personal', defaultMessage: 'My Sources and Collections' },
};

const SourceManagerContainer = (props) => {
  const { favoritedSources, favoritedCollections, featuredCollections, popularCollections } = props;
  const { formatMessage } = props.intl;
  let myFavorites = null;
  if (favoritedSources) {
    myFavorites = (
      <div>
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
          {featuredCollections.map((c, idx) => (
            <tr key={c.tags_id} className={(idx % 2 === 0) ? 'even' : 'odd'}>
              <td>
                <Link to={`/collections/${c.tags_id}`}>{c.label}</Link>
              </td>
              <td>
                {c.description}
              </td>
            </tr>
          ))}
        </Col>
        <Col lg={4} xs={12}>
          {myFavorites}
        </Col>
      </Row>
      <Row>
        <Col lg={8} xs={12}>
          <h2>
            <FormattedMessage {...localMessages.browse} />
          </h2>
          {popularCollections.map((c, idx) => (
            <tr key={c.tags_id} className={(idx % 2 === 0) ? 'even' : 'odd'}>
              <td>
                <Link to={`/collections/${c.tags_id}`}>{c.label}</Link>
              </td>
              <td>
                {c.description}
              </td>
            </tr>
          ))}
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
  featuredCollections: React.PropTypes.array.isRequired,
  popularCollections: React.PropTypes.array.isRequired,
};

SourceManagerContainer.contextTypes = {
  store: React.PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.sources.collections.favorited.fetchStatus,
  favoritedSources: state.sources.sources.favorited.list,
  favoritedCollections: state.sources.collections.favorited.list,
  featuredCollections: state.sources.collections.featured.list,
  popularCollections: state.sources.collections.popular.list,
});


const mapDispatchToProps = dispatch => ({
  fetchData: () => {
    dispatch(fetchFavoriteCollections());
    dispatch(fetchFavoriteSources());
    dispatch(fetchFeaturedCollectionList());
    dispatch(fetchPopularCollectionList());
  },
  asyncFetch: () => {
    dispatch(fetchFavoriteCollections());
    dispatch(fetchFavoriteSources());
    dispatch(fetchFeaturedCollectionList());
    dispatch(fetchPopularCollectionList());
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
