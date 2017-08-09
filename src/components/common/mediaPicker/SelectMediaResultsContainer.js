import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../AsyncContainer';
import { selectMedia, selectMediaPickerQueryArgs, fetchMediaPickerCollections, fetchMediaPickerSources, fetchMediaPickerFeaturedCollections } from '../../../actions/systemActions';
import ContentPreview from '../ContentPreview';
import SelectMediaForm from './SelectMediaForm';
import { PICK_COLLECTION, PICK_SOURCE, ADVANCED, STARRED } from '../../../lib/explorerUtil';
import * as fetchConstants from '../../../lib/fetchConstants';
/*
const localMessages = {
  searchByName: { id: 'system.mediaPicker.select.searchby.name', defaultMessage: 'Search by Name/URL' },
  searchByMetadata: { id: 'system.mediaPicker.select.searchby.metadata', defaultMessage: 'Search by Metadata' },
  selectedMedia: { id: 'system.mediaPicker.select.media', defaultMessage: 'Selected Media' },
  pubCountrySuggestion: { id: 'system.mediaPicker.select.pubCountryTip', defaultMessage: 'published in' },
  pubStateSuggestion: { id: 'system.mediaPicker.select.pubStateTip', defaultMessage: 'state published in' },
  pLanguageSuggestion: { id: 'system.mediaPicker.select.pLanguageTip', defaultMessage: 'primary language' },
}; */

class SelectMediaResultsContainer extends React.Component {
  updateMediaQuery(values) {
    const { updateMediaSelection, selectedMediaQueryType } = this.props;
    const updatedQueryObj = Object.assign({}, values, { type: selectedMediaQueryType });
    updateMediaSelection(updatedQueryObj);
  }
  handleSelectMedia(media) {
    const { handleSelection } = this.props;
    handleSelection(media);
  }
  render() {
    const { selectedMediaQueryType, selectedMediaQueryKeyword, collectionResults, sourcesResults, starredResults, featured } = this.props; // TODO differentiate betwee coll and src
    let content = null;
    let whichMedia = null;
    let whichStoredKeyword = { keyword: selectedMediaQueryKeyword };
    // user the media that matches the selected media query
    switch (selectedMediaQueryType) {
      case PICK_COLLECTION:
        if (collectionResults && (collectionResults.list && (collectionResults.list.length > 0 || (collectionResults.args && collectionResults.args.keyword)))) {
          whichMedia = collectionResults.list; // since this is the default, check keyword, otherwise it'll be empty
          whichStoredKeyword = collectionResults.args;
        } else {
          whichMedia = featured;
        }
        break;
      case PICK_SOURCE:
        if (sourcesResults && (sourcesResults.list && (sourcesResults.list.length > 0 || (sourcesResults.args && sourcesResults.args.keyword)))) {
          whichMedia = sourcesResults.list; // since this is the default, check keyword, otherwise it'll be empty
          whichStoredKeyword = sourcesResults.args;
        }
        break;
      case ADVANCED:
        break;
      case STARRED:
        whichMedia = starredResults;
        break;
      default:
        whichMedia = featured;
        break;
    }
    if (whichMedia && whichMedia.length > 0) {
      content = (
        <ContentPreview
          items={whichMedia}
          classStyle="browse-items"
          itemType="media"
          linkInfo={c => `whichMedia/${c.tags_id || c.media_id}`}
          linkDisplay={c => (c.label ? c.label : c.name)}
          onClick={this.handleSelectMedia}
        />
      );
    }
    return (
      <div className="select-media-container">
        <SelectMediaForm initialValues={whichStoredKeyword} onSearch={val => this.updateMediaQuery(val)} />
        {content}
      </div>
    );
  }
}

SelectMediaResultsContainer.propTypes = {
  intl: React.PropTypes.object.isRequired,
  handleSelection: React.PropTypes.func,
  media: React.PropTypes.array,
  updateMediaSelection: React.PropTypes.func.isRequired,
  selectedMediaQueryKeyword: React.PropTypes.string,
  selectedMediaQueryType: React.PropTypes.number,
  featured: React.PropTypes.array,
  collectionResults: React.PropTypes.object,
  sourcesResults: React.PropTypes.object,
  starredResults: React.PropTypes.object,
};

const mapStateToProps = state => ({
  fetchStatus: (state.system.mediaPicker.sourceQueryResults.fetchStatus === fetchConstants.FETCH_SUCCEEDED || state.system.mediaPicker.collectionQueryResults.fetchStatus === fetchConstants.FETCH_SUCCEEDED || state.system.mediaPicker.featured.fetchStatus === fetchConstants.FETCH_SUCCEEDED) ? fetchConstants.FETCH_SUCCEEDED : fetchConstants.FETCH_INVALID,
  selectedMediaQueryType: state.system.mediaPicker.selectMediaQuery ? state.system.mediaPicker.selectMediaQuery.args.type : 0,
  selectedMediaQueryKeyword: state.system.mediaPicker.selectMediaQuery ? state.system.mediaPicker.selectMediaQuery.args.keyword : null,
  sourcesResults: state.system.mediaPicker.sourceQueryResults,
  featured: state.system.mediaPicker.featured ? state.system.mediaPicker.featured.results : null,
  collectionResults: state.system.mediaPicker.collectionQueryResults,
  starredResults: state.system.mediaPicker.starredQueryResults ? state.system.mediaPicker.starredQueryResults : null,
});

const mapDispatchToProps = dispatch => ({
  updateMediaSelection: (values) => {
    if (values) {
      dispatch(selectMediaPickerQueryArgs(values));
      switch (values.type) {
        case PICK_COLLECTION:
          dispatch(fetchMediaPickerCollections(values));
          break;
        case PICK_SOURCE:
          dispatch(fetchMediaPickerSources(values));
          break;
        case ADVANCED:
          break;
        case STARRED:
          dispatch(fetchMediaPickerFeaturedCollections(5)); // TODO make this a real search
          break;
        default:
          break;
      }
    }
  },
  handleSelection: (selectedMedia) => {
    if (selectedMedia) {
      dispatch(selectMedia(selectedMedia));
    }
  },
  asyncFetch: () => {
    // what kind of media is being queried for?
    // default to PICK_COLLECTION
    dispatch(fetchMediaPickerFeaturedCollections(5)); // TODO make this a real search or "all"
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeAsyncContainer(
        SelectMediaResultsContainer
      )
    )
  );

