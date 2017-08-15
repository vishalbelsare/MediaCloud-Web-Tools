import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../AsyncContainer';
import { selectMedia, selectMediaPickerQueryArgs, fetchMediaPickerCollections, fetchMediaPickerSources, fetchMediaPickerFeaturedCollections } from '../../../actions/systemActions';
import MediaPickerPreviewList from '../MediaPickerPreviewList';
import SelectMediaForm from './SelectMediaForm';
import messages from '../../../resources/messages';
import { PICK_COLLECTION, PICK_SOURCE, ADVANCED, STARRED } from '../../../lib/explorerUtil';
import * as fetchConstants from '../../../lib/fetchConstants';
import composeHelpfulContainer from '../../common/HelpfulContainer';

const localMessages = {
  title: { id: 'system.mediaPicker.select.title', defaultMessage: 'title' },
  intro: { id: 'system.mediaPicker.select.info',
    defaultMessage: '<p>This is an intro</p>' },
  helpTitle: { id: 'system.mediaPicker.select.help.title', defaultMessage: 'About Media' },
};


class SelectMediaResultsContainer extends React.Component {
  componentWillMount() {
    this.correlateSelection(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.correlateSelection(nextProps);
  }

  correlateSelection(whichProps) {
    const { selectedMedia, selectedMediaQueryType, collectionResults, featured, handleSelectionOfMedia } = this.props;
    switch (selectedMediaQueryType) {
      case PICK_COLLECTION:
        if (selectedMedia && selectedMedia.length > 0) {
          if (collectionResults && collectionResults.list.length > 0) {
            whichProps.collectionResults.list.some(v => selectedMedia.indexOf(v.id));
          } else if (featured && featured.list.length > 0) {
            whichProps.featured.list.map(v => (
              selectedMedia.map((s) => {
                if ((s.tags_id === v.id || s.id === v.id) && v.selected === false) {
                  handleSelectionOfMedia(v); // concurrency between selected list and resutl list
                  return true;
                }
                return false;
              })),
            );
          }
        }
        break;
      case PICK_SOURCE:
      case STARRED:
        return featured;
      default:
        break;
    }
    return 0;
  }

  updateMediaQuery(values) {
    const { updateMediaQuerySelection, selectedMediaQueryType } = this.props;
    const updatedQueryObj = Object.assign({}, values, { type: selectedMediaQueryType });
    updateMediaQuerySelection(updatedQueryObj);
  }
  handleSelectMedia(media) {
    const { handleSelectionOfMedia } = this.props;
    handleSelectionOfMedia(media);
  }
  render() {
    const { selectedMediaQueryType, selectedMediaQueryKeyword, collectionResults, sourcesResults, starredResults, featured } = this.props; // TODO differentiate betwee coll and src
    let content = null;
    let whichMedia = null;
    let whichStoredKeyword = { keyword: selectedMediaQueryKeyword };
    // user the media that matches the selected media query

    /* maybe just on willMount
      update the data with the selected info we have from the explorer query
      selectedMedia.forEach().find in selected media results array
      and set selected = true
      so that the MediaSlectionContainer shows the items already selected and
      the SelectMediaResultsContainer has greyed out buttons appropriately */

    switch (selectedMediaQueryType) {
      case PICK_COLLECTION:
        if (collectionResults && (collectionResults.list && (collectionResults.list.length > 0 || (collectionResults.args && collectionResults.args.keyword)))) {
          whichMedia = collectionResults.list; // since this is the default, check keyword, otherwise it'll be empty
          whichStoredKeyword = collectionResults.args;
        } else {
          whichMedia = featured.list;
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
        <MediaPickerPreviewList
          items={whichMedia}
          classStyle="browse-items"
          itemType="media"
          linkInfo={c => `whichMedia/${c.tags_id || c.media_id}`}
          linkDisplay={c => (c.label ? c.label : c.name)}
          onClick={c => this.handleSelectMedia(c)}
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
  handleSelectionOfMedia: React.PropTypes.func.isRequired,
  media: React.PropTypes.array,
  updateMediaQuerySelection: React.PropTypes.func.isRequired,
  selectedMediaQueryKeyword: React.PropTypes.string,
  selectedMediaQueryType: React.PropTypes.number,
  featured: React.PropTypes.object,
  collectionResults: React.PropTypes.object,
  sourcesResults: React.PropTypes.object,
  starredResults: React.PropTypes.object,
  selectedMedia: React.PropTypes.array,
};

const mapStateToProps = state => ({
  fetchStatus: (state.system.mediaPicker.sourceQueryResults.fetchStatus === fetchConstants.FETCH_SUCCEEDED || state.system.mediaPicker.collectionQueryResults.fetchStatus === fetchConstants.FETCH_SUCCEEDED || state.system.mediaPicker.featured.fetchStatus === fetchConstants.FETCH_SUCCEEDED) ? fetchConstants.FETCH_SUCCEEDED : fetchConstants.FETCH_INVALID,
  selectedMedia: state.system.mediaPicker.selectMedia.list,
  selectedMediaQueryType: state.system.mediaPicker.selectMediaQuery ? state.system.mediaPicker.selectMediaQuery.args.type : 0,
  selectedMediaQueryKeyword: state.system.mediaPicker.selectMediaQuery ? state.system.mediaPicker.selectMediaQuery.args.keyword : null,
  sourcesResults: state.system.mediaPicker.sourceQueryResults,
  featured: state.system.mediaPicker.featured ? state.system.mediaPicker.featured : null,
  collectionResults: state.system.mediaPicker.collectionQueryResults,
  starredResults: state.system.mediaPicker.starredQueryResults ? state.system.mediaPicker.starredQueryResults : null,
});

const mapDispatchToProps = dispatch => ({
  updateMediaQuerySelection: (values) => {
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
          dispatch(fetchMediaPickerFeaturedCollections());
          break;
        default:
          break;
      }
    }
  },
  handleSelectionOfMedia: (selectedMedia) => {
    if (selectedMedia) {
      dispatch(selectMedia(selectedMedia)); // disable MediaPickerPreviewList button too
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
        composeHelpfulContainer(localMessages.helpTitle, [localMessages.intro, messages.mediaPickerHelpText])(
          SelectMediaResultsContainer
        )
      )
    )
  );

