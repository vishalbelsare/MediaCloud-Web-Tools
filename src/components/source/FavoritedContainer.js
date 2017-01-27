import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import composeAsyncContainer from '../common/AsyncContainer';
import { fetchFavoriteSources, fetchFavoriteCollections } from '../../actions/sourceActions';
import composeHelpfulContainer from '../common/HelpfulContainer';
import SourceList from '../common/SourceList';
import CollectionList from '../common/CollectionList';

const localMessages = {
  favoritedCollectionsTitle: { id: 'favorited.collections.title', defaultMessage: 'Favorited Collections' },
  favoritedSourcesTitle: { id: 'favorited.souces.title', defaultMessage: 'Favorited Sources' },
  helpTitle: { id: 'favorited.help.text.title',
    defaultMessage: 'Favorited items',
  },
  helpText: { id: 'favorited.help.text',
    defaultMessage: 'Here is a list of favorited items. Click one to explore it.',
  },
};

const FavoritedContainer = (props) => {
  const { favoritedSources, favoritedCollections, helpButton } = props;
  const { formatMessage } = props.intl;
  return (
    <Grid>
      <Row>
        <Col lg={6}>
          <SourceList
            title={formatMessage(localMessages.favoritedSourcesTitle)}
            sources={favoritedSources}
            helpButton={helpButton}
            downloadUrl="/api/favorites/sources.csv"
          />
        </Col>
        <Col lg={6}>
          <CollectionList
            title={formatMessage(localMessages.favoritedCollectionsTitle)}
            collections={favoritedCollections}
            helpButton={helpButton}
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
  helpButton: React.PropTypes.node.isRequired,
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
      composeHelpfulContainer(localMessages.helpTitle, [localMessages.helpText])(
        composeAsyncContainer(
          FavoritedContainer
        )
      )
    )
  );
