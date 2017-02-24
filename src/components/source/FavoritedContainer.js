import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import composeAsyncContainer from '../common/AsyncContainer';
import { fetchFavoriteSources, fetchFavoriteCollections } from '../../actions/sourceActions';
import SourceList from '../common/SourceList';
import CollectionList from '../common/CollectionList';

const localMessages = {
  favoritedCollectionsTitle: { id: 'favorited.collections.title', defaultMessage: 'My Favorite Collections' },
  favoritedCollectionsIntro: { id: 'favorited.collections.intro', defaultMessage: 'These are collections you have marked as favorites by clicking the star next to their name.  This is useful to bookmark collections you use frequently.' },
  favoritedSourcesTitle: { id: 'favorited.souces.title', defaultMessage: 'My Favorite Sources' },
  favoritedSourcesIntro: { id: 'favorited.souces.intro', defaultMessage: 'These are sources you have marked as favorites by clicking the star next to their name.  This is useful to bookmark sources you use frequently.' },
};

const FavoritedContainer = (props) => {
  const { favoritedSources, favoritedCollections } = props;
  const { formatMessage } = props.intl;
  return (
    <Grid>
      <Row>
        <Col lg={6}>
          <SourceList
            title={formatMessage(localMessages.favoritedSourcesTitle)}
            intro={formatMessage(localMessages.favoritedSourcesIntro)}
            sources={favoritedSources}
            downloadUrl="/api/favorites/sources.csv"
          />
        </Col>
        <Col lg={6}>
          <CollectionList
            title={formatMessage(localMessages.favoritedCollectionsTitle)}
            intro={formatMessage(localMessages.favoritedCollectionsIntro)}
            collections={favoritedCollections}
          />
        </Col>
      </Row>
    </Grid>
  );
};

FavoritedContainer.propTypes = {
  // from state
  fetchStatus: React.PropTypes.string,
  total: React.PropTypes.number,
  // from parent
  favoritedSources: React.PropTypes.array.isRequired,
  favoritedCollections: React.PropTypes.array.isRequired,
  // from dispatch
  asyncFetch: React.PropTypes.func.isRequired,
  // from composition
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.sources.collections.favorited.fetchStatus,
  favoritedSources: state.sources.sources.favorited.list,
  favoritedCollections: state.sources.collections.favorited.list,
});

const mapDispatchToProps = dispatch => ({
  asyncFetch: () => {
    dispatch(fetchFavoriteCollections());
    dispatch(fetchFavoriteSources());
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeAsyncContainer(
        FavoritedContainer
      )
    )
  );
