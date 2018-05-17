import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../AsyncContainer';
import CollectionResultsTable from './CollectionResultsTable';
import { selectMediaPickerQueryArgs, fetchFavoriteSources, fetchFavoriteCollections } from '../../../../actions/systemActions';
import SourceResultsTable from './SourceResultsTable';
import { FETCH_ONGOING } from '../../../../lib/fetchConstants';
import LoadingSpinner from '../../../common/LoadingSpinner';
import MediaPickerSearchForm from '../MediaPickerSearchForm';
import { notEmptyString } from '../../../../lib/formValidators';

const localMessages = {
  collTitle: { id: 'system.mediaPicker.favorited.title', defaultMessage: 'Starred collections matching "{name}"' },
  sourceTitle: { id: 'system.mediaPicker.favorited.title', defaultMessage: 'Starred sources matching "{name}"' },
  hintText: { id: 'system.mediaPicker.favorited.hint', defaultMessage: 'Search for favorites by name' },
  noResults: { id: 'system.mediaPicker.favorited.noResults', defaultMessage: 'No results. Try searching for issues like online news, health, blogs, conservative to see if we have collections made up of those types of sources.' },
};


const StarredSearchResultsContainer = (props) => {
  const { selectedMediaQueryKeyword, favoritedCollections, favoritedSources, onSearch, handleToggleAndSelectMedia, fetchStatus, hintTextMsg } = props;
  const { formatMessage } = props.intl;
  let content = null;
  if (fetchStatus === FETCH_ONGOING) {
    // we have to do this here to show a loading spinner when first searching (and featured collections are showing)
    content = <LoadingSpinner />;
  } else if (favoritedCollections && favoritedSources) {
    content = (
      <div>
        <CollectionResultsTable
          title={formatMessage(localMessages.collTitle, { name: selectedMediaQueryKeyword })}
          collections={favoritedCollections}
          handleToggleAndSelectMedia={handleToggleAndSelectMedia}
        />
        <SourceResultsTable
          title={formatMessage(localMessages.sourceTitle, { name: selectedMediaQueryKeyword })}
          sources={favoritedSources}
          handleToggleAndSelectMedia={handleToggleAndSelectMedia}
        />
      </div>
    );
  } else {
    content = <FormattedMessage {...localMessages.noResults} />;
  }
  return (
    <div>
      <MediaPickerSearchForm
        initValues={{ storedKeyword: { mediaKeyword: selectedMediaQueryKeyword } }}
        onSearch={val => onSearch(val)}
        hintText={formatMessage(hintTextMsg || localMessages.hintText)}
      />
      {content}
    </div>
  );
};


StarredSearchResultsContainer.propTypes = {
  // form compositional chain
  intl: PropTypes.object.isRequired,
  // from parent
  handleToggleAndSelectMedia: PropTypes.func.isRequired,
  whichTagSet: PropTypes.number,
  hintTextMsg: PropTypes.object,
  onSearch: PropTypes.func.isRequired,
  // from state
  selectedMediaQueryKeyword: PropTypes.string,
  selectedMediaQueryType: PropTypes.number,
  favoritedCollections: PropTypes.array,
  favoritedSources: PropTypes.array,
  initCollections: PropTypes.array,
  fetchStatus: PropTypes.string,
};

const mapStateToProps = state => ({
  fetchStatus: state.system.mediaPicker.favoritedCollections.fetchStatus || state.system.mediaPicker.favoritedSources.fetchStatus,
  selectedMediaQueryType: state.system.mediaPicker.selectMediaQuery ? state.system.mediaPicker.selectMediaQuery.args.type : 0,
  selectedMediaQueryKeyword: state.system.mediaPicker.selectMediaQuery ? state.system.mediaPicker.selectMediaQuery.args.mediaKeyword : null,
  favoritedCollections: state.system.mediaPicker.favoritedCollections ? state.system.mediaPicker.favoritedCollections.list : null,
  favoritedSources: state.system.mediaPicker.favoritedSources ? state.system.mediaPicker.favoritedSources.list : null,
});

const mapDispatchToProps = dispatch => ({
  onSearch: (values) => {
    if (values && notEmptyString(values.mediaKeyword)) {
      dispatch(selectMediaPickerQueryArgs(values));
      dispatch(fetchFavoriteCollections({ media_keyword: values.mediaKeyword }));
      dispatch(fetchFavoriteSources({ media_keyword: values.mediaKeyword }));
    }
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
        StarredSearchResultsContainer
      )
    )
  );

