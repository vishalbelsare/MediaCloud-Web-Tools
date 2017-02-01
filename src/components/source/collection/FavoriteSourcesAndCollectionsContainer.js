import React from 'react';
import Title from 'react-title-component';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Grid } from 'react-flexbox-grid/lib';
import Link from 'react-router/lib/Link';
import DataCard from '../../common/DataCard';
import { fetchFavoriteCollections, fetchFavoriteSources } from '../../../actions/sourceActions';
import composeAsyncContainer from '../../common/AsyncContainer';
import messages from '../../../resources/messages';
import { ExploreButton } from '../../common/IconButton';

const localMessages = {
  mainTitle: { id: 'collection.popular.mainTitle', defaultMessage: 'Favorited Sources and Collections' },
  personal: { id: 'collection.intro.personal', defaultMessage: 'My Sources and Collections' },
};

const FavoriteSourcesAndCollectionsContainer = (props) => {
  const { favoritedSources, favoritedCollections } = props;
  const { formatMessage } = props.intl;
  const titleHandler = parentTitle => `${formatMessage(localMessages.mainTitle)} | ${parentTitle}`;
  const RESULTS = 5;
  let srccontent = null;
  let colcontent = null;
  if (favoritedSources && favoritedSources.length > 0) {
    srccontent = (
      favoritedSources.slice(0, RESULTS).map((c, idx) =>
        <div key={idx} >{c.name}</div>
      )
    );
  }
  if (favoritedCollections && favoritedCollections.length > 0) {
    colcontent = (
      favoritedCollections.slice(0, RESULTS).map((c, idx) =>
        <div key={idx} >{c.name}</div>
      )
    );
  }

  return (
    <DataCard>
      <h1>
        <FormattedMessage {...localMessages.personal} />
      </h1>
      <Link to={'favorites'}>
        <FormattedMessage {...messages.exploreFavorites} />
      </Link>
      &nbsp;
      <ExploreButton linkTo={'/favorites'} />
      <Grid>
        <Title render={titleHandler} />
        <h2>
          <FormattedMessage {...localMessages.mainTitle} />
        </h2>
        {srccontent}
        {colcontent}
      </Grid>
    </DataCard>
  );
};

FavoriteSourcesAndCollectionsContainer.propTypes = {
  fetchStatus: React.PropTypes.string.isRequired,
  favoritedSources: React.PropTypes.array.isRequired,
  favoritedCollections: React.PropTypes.array.isRequired,
  intl: React.PropTypes.object.isRequired,
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
        FavoriteSourcesAndCollectionsContainer
      )
    )
  );
