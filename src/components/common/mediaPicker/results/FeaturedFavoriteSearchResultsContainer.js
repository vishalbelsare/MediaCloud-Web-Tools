import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../AsyncContainer';
import { selectMediaPickerQueryArgs, fetchMediaPickerFeaturedCollections, fetchFavoriteCollections, fetchFavoriteSources } from '../../../../actions/systemActions';
import TabSearchResultsContainer from './TabSearchResultsContainer';
import TAG_SET_MC_ID from '../../../../lib/tagUtil';

const localMessages = {
  title: { id: 'system.mediaPicker.collections.title', defaultMessage: 'Collections matching "{name}"' },
  hintText: { id: 'system.mediaPicker.collections.hint', defaultMessage: 'Search collections by name' },
  noResults: { id: 'system.mediaPicker.collections.noResults', defaultMessage: 'No results. Try searching for issues like online news, health, blogs, conservative to see if we have collections made up of those types of sources.' },
};


class FeaturedFavoriteSearchResultsContainer extends React.Component {
  updateMediaQuery(values) {
    const { updateMediaQuerySelection, selectedMediaQueryType } = this.props;
    const updatedQueryObj = Object.assign({}, values, { type: selectedMediaQueryType });
    updateMediaQuerySelection(updatedQueryObj);
  }
  render() {
    const { selectedMediaQueryType, selectedMediaQueryKeyword, featured, favoritedCollections, favoritedSources, handleToggleAndSelectMedia, fetchStatus } = this.props;
    const queryResults = {
      featured,
      favoritedCollections,
      favoritedSources,
    };
    return (
      <div>
        <TabSearchResultsContainer
          fetchStatus={fetchStatus}
          handleToggleAndSelectMedia={handleToggleAndSelectMedia}
          selectedMediaQueryType={selectedMediaQueryType}
          selectedMediaQueryKeyword={selectedMediaQueryKeyword}
          queryResults={queryResults}
          initValues={{ storedKeyword: { mediaKeyword: selectedMediaQueryKeyword } }}
          onSearch={val => this.updateMediaQuery(val)}
          hintTextMsg={localMessages.hintText}
        />
      </div>
    );
  }
}

FeaturedFavoriteSearchResultsContainer.propTypes = {
  // form compositional chain
  intl: PropTypes.object.isRequired,
  // from parent
  handleToggleAndSelectMedia: PropTypes.func.isRequired,
  whichTagSet: PropTypes.array,
  // from dispatch
  updateMediaQuerySelection: PropTypes.func.isRequired,
  // from state
  selectedMediaQueryKeyword: PropTypes.string,
  selectedMediaQueryType: PropTypes.number,
  featured: PropTypes.object,
  favoritedCollections: PropTypes.object,
  favoritedSources: PropTypes.object,
  fetchStatus: PropTypes.string,
};

const mapStateToProps = state => ({
  fetchStatus: state.system.mediaPicker.featured.fetchStatus,
  selectedMediaQueryType: state.system.mediaPicker.selectMediaQuery ? state.system.mediaPicker.selectMediaQuery.args.type : 0,
  selectedMediaQueryKeyword: state.system.mediaPicker.selectMediaQuery ? state.system.mediaPicker.selectMediaQuery.args.mediaKeyword : null,
  featured: state.system.mediaPicker.featured ? state.system.mediaPicker.featured : null,
  favoritedCollections: state.system.mediaPicker.favoritedCollections ? state.system.mediaPicker.favoritedCollections.results : null,
  favoritedSources: state.system.mediaPicker.favoritedSources ? state.system.mediaPicker.favoritedSources.results : null,

});

const mapDispatchToProps = dispatch => ({
  updateMediaQuerySelection: (values) => {
    if (values) {
      dispatch(selectMediaPickerQueryArgs(values));
      dispatch(fetchMediaPickerFeaturedCollections(TAG_SET_MC_ID));
      dispatch(fetchFavoriteCollections({ media_keyword: values.mediaKeyword }));
      dispatch(fetchFavoriteSources({ media_keyword: values.mediaKeyword }));
    }
  },
  asyncFetch: () => {
    dispatch(fetchMediaPickerFeaturedCollections(TAG_SET_MC_ID));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeAsyncContainer(
        FeaturedFavoriteSearchResultsContainer
      )
    )
  );
