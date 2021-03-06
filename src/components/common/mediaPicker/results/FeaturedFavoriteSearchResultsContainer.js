import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import withAsyncFetch from '../../hocs/AsyncContainer';
import * as fetchConstants from '../../../../lib/fetchConstants';
import { selectMediaPickerQueryArgs, fetchMediaPickerFeaturedCollections, fetchFavoriteCollections, fetchFavoriteSources } from '../../../../actions/systemActions';
import TabSearchResultsContainer from './TabSearchResultsContainer';
import TAG_SET_MC_ID from '../../../../lib/tagUtil';

const localMessages = {
  title: { id: 'system.mediaPicker.collections.title', defaultMessage: 'Collections matching "{name}"' },
  hintText: { id: 'system.mediaPicker.collections.hint', defaultMessage: 'Search collections by name' },
  noResults: { id: 'system.mediaPicker.collections.noResults', defaultMessage: 'No results. Try searching for issues like online news, health, blogs, conservative to see if we have collections made up of those types of sources.' },
};


class FeaturedFavoriteSearchResultsContainer extends React.Component {
  componentWillMount() {
    this.correlateSelection(this.props);
  }
  componentWillReceiveProps(nextProps) {
    // PICK_FEATURED
    if (nextProps.selectedMediaQueryType !== this.props.selectedMediaQueryType) {
      this.updateMediaQuery({ type: nextProps.selectedMediaQueryType });
    }
    if (nextProps.selectedMedia !== this.props.selectedMedia ||
      // if the results have changed from a keyword entry, we need to update the UI
      (nextProps.featured && nextProps.featured.lastFetchSuccess !== this.props.featured.lastFetchSuccess) ||
      (nextProps.favoritedCollections && nextProps.favoritedCollections.lastFetchSuccess !== this.props.favoritedCollections.lastFetchSuccess) ||
      (nextProps.favoritedSources && nextProps.favoritedSources.lastFetchSuccess !== this.props.favoritedSources.lastFetchSuccess)) {
      this.correlateSelection(nextProps);
    }
  }

  correlateSelection(whichProps) {
    let whichList = [];

    if ((whichProps.favoritedCollections.list && whichProps.favoritedCollections.list.length > 0) ||
      (whichProps.favoritedSources.list && whichProps.favoritedSources.list.length > 0)) {
      whichList = whichProps.favoritedCollections.list;
      whichList = whichList.concat(whichProps.favoritedSources.list);
    }
    whichList = whichList.concat(whichProps.featured.list);

    // if selected media has changed, update current results
    if (whichProps.selectedMedia && whichProps.selectedMedia.length > 0 &&
      // we can't be sure we have received results yet
      whichList && whichList.length > 0) {
      // sync up selectedMedia and push to result sets.
      whichList.map((m) => {
        const mediaIndex = whichProps.selectedMedia.findIndex(q => q.id === m.id);
        if (mediaIndex < 0) {
          this.props.handleMediaConcurrency(m, false);
        } else if (mediaIndex >= 0) {
          this.props.handleMediaConcurrency(m, true);
        }
        return m;
      });
    }
    return 0;
  }
  updateMediaQuery(values) {
    const { updateMediaQuerySelection, selectedMediaQueryType } = this.props;
    const updatedQueryObj = Object.assign({}, values, { type: selectedMediaQueryType });
    updateMediaQuerySelection(updatedQueryObj);
  }
  render() {
    const { selectedMediaQueryType, featured, favoritedCollections, favoritedSources, handleToggleAndSelectMedia, fetchStatus, displayResults } = this.props;
    const queryResults = {
      featured: featured.list,
      favoritedCollections: favoritedCollections.list,
      favoritedSources: favoritedSources.list,
    };
    return (
      <div>
        <TabSearchResultsContainer
          fetchStatus={fetchStatus}
          displayResults={displayResults}
          handleToggleAndSelectMedia={handleToggleAndSelectMedia}
          selectedMediaQueryType={selectedMediaQueryType}
          queryResults={queryResults}
          initValues={{ storedKeyword: { mediaKeyword: '' } }}
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
  handleMediaConcurrency: PropTypes.func.isRequired,
  whichTagSet: PropTypes.array,
  // from dispatch
  updateMediaQuerySelection: PropTypes.func.isRequired,
  // from state
  selectedMedia: PropTypes.array,
  selectedMediaQueryType: PropTypes.number,
  featured: PropTypes.object,
  favoritedCollections: PropTypes.object,
  favoritedSources: PropTypes.object,
  fetchStatus: PropTypes.string,
  displayResults: PropTypes.bool,
};

const mapStateToProps = state => ({
  fetchStatus: state.system.mediaPicker.favoritedCollections.fetchStatus || state.system.mediaPicker.favoritedSources.fetchStatus || state.system.mediaPicker.featured.fetchStatus,
  displayResults: state.system.mediaPicker.featured.fetchStatus === fetchConstants.FETCH_SUCCEEDED || (state.system.mediaPicker.favoritedCollections.fetchStatus === fetchConstants.FETCH_SUCCEEDED && state.system.mediaPicker.favoritedSources.fetchStatus === fetchConstants.FETCH_SUCCEEDED),
  selectedMediaQueryType: state.system.mediaPicker.selectMediaQuery ? state.system.mediaPicker.selectMediaQuery.args.type : 0,
  selectedMedia: state.system.mediaPicker.selectMedia.list,
  featured: state.system.mediaPicker.featured ? state.system.mediaPicker.featured : null,
  favoritedCollections: state.system.mediaPicker.favoritedCollections ? state.system.mediaPicker.favoritedCollections : null,
  favoritedSources: state.system.mediaPicker.favoritedSources ? state.system.mediaPicker.favoritedSources : null,

});

const mapDispatchToProps = dispatch => ({
  updateMediaQuerySelection: (values) => {
    if (values) {
      dispatch(selectMediaPickerQueryArgs(values));
      dispatch(fetchMediaPickerFeaturedCollections(TAG_SET_MC_ID));
      dispatch(fetchFavoriteCollections());
      dispatch(fetchFavoriteSources());
    }
  },
  asyncFetch: () => {
    dispatch(selectMediaPickerQueryArgs(0));
    dispatch(fetchMediaPickerFeaturedCollections(TAG_SET_MC_ID));
    dispatch(fetchFavoriteCollections());
    dispatch(fetchFavoriteSources());
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      withAsyncFetch(
        FeaturedFavoriteSearchResultsContainer
      )
    )
  );
