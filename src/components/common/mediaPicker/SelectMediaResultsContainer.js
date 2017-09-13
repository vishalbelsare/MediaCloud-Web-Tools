import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../AsyncContainer';
import { selectMedia, toggleMedia, selectMediaPickerQueryArgs, fetchMediaPickerCollections, fetchMediaPickerSources, fetchMediaPickerFeaturedCollections } from '../../../actions/systemActions';
import MediaPickerPreviewList from '../MediaPickerPreviewList';
import SelectMediaForm from './SelectMediaForm';
import messages from '../../../resources/messages';
import { PICK_COLLECTION, PICK_SOURCE, ADVANCED, STARRED } from '../../../lib/explorerUtil';
import * as fetchConstants from '../../../lib/fetchConstants';
import composeHelpfulContainer from '../../common/HelpfulContainer';
import LoadingSpinner from '../../common/LoadingSpinner';

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
    let whichList = [];
    switch (whichProps.selectedMediaQueryType) {
      case PICK_COLLECTION:
        if (whichProps.collectionResults && whichProps.collectionResults.list.length > 0) {
          whichList = whichProps.collectionResults;
        } else if (whichProps.featured && whichProps.featured.list.length > 0) {
          whichList = whichProps.featured;
        }
        break;
      case PICK_SOURCE:
        whichList = whichProps.sourceResults;
        break;
      case STARRED:
        whichList = whichProps.starredResults;
        break;
      // case ADVANCED: TBD
      default:
        break;
    }
    if (whichProps.selectedMedia && whichProps.selectedMedia.length > 0 && whichList.list && whichList.list.length > 0) {
      // update current list regardless - find matches in selected and issue select_media action
      // infinite loop though if we dont' stop...
      whichProps.selectedMedia.map(s => (
        whichList.list.map((v) => {
          if ((s.tags_id === v.id || s.id === v.id) && !v.selected) {
            this.props.handleMediaConcurrency(s); // update if
            return true;
          } // TODO else we shoudl unselect
          return false;
        })),
      );
    }
    return 0;
  }

  updateMediaQuery(values) {
    const { updateMediaQuerySelection, selectedMediaQueryType } = this.props;
    const updatedQueryObj = Object.assign({}, values, { type: selectedMediaQueryType });
    updateMediaQuerySelection(updatedQueryObj);
  }
  handleToggleAndSelectMedia(media) {
    const { handleToggleAndSelectMedia } = this.props;
    handleToggleAndSelectMedia(media);
  }

  render() {
    const { timestamp, selectedMediaQueryType, selectedMediaQueryKeyword, collectionResults, sourceResults, starredResults, featured } = this.props; // TODO differentiate betwee coll and src
    let content = null;
    let whichMedia = null;
    let whichStoredKeyword = { keyword: selectedMediaQueryKeyword };
    let whichFetchStatus = null;
    switch (selectedMediaQueryType) {
      case PICK_COLLECTION:
        if (collectionResults && (collectionResults.list && (collectionResults.list.length > 0 || (collectionResults.args && collectionResults.args.keyword)))) {
          whichMedia = collectionResults.list; // since this is the default, check keyword, otherwise it'll be empty
          whichStoredKeyword = collectionResults.args;
          whichFetchStatus = collectionResults.fetchStatus;
          whichMedia.type = 'collections';
        } else {
          whichMedia = featured.list;
          whichFetchStatus = featured.fetchStatus;
        }
        break;
      case PICK_SOURCE:
        if (sourceResults && (sourceResults.list && (sourceResults.list.length > 0 || (sourceResults.args && sourceResults.args.keyword)))) {
          whichMedia = sourceResults.list;
          whichStoredKeyword = sourceResults.args;
          whichFetchStatus = sourceResults.fetchStatus;
          whichMedia.type = 'sources';
        }
        break;
      case ADVANCED:
        break;
      case STARRED:
        if (starredResults && (starredResults.list && (starredResults.list.length > 0 || (starredResults.args && starredResults.args.keyword)))) {
          whichMedia = starredResults.list;
          whichStoredKeyword = starredResults.args;
          whichFetchStatus = sourceResults.fetchStatus;
          whichMedia.type = 'collections';
        }
        break;
      default:
        whichMedia = featured;
        break;
    }
    if (whichFetchStatus === fetchConstants.FETCH_ONGOING) {
      content = <LoadingSpinner />;
    } else if (whichMedia && whichMedia.length > 0) {
      content = (
        <MediaPickerPreviewList
          items={whichMedia}
          timestamp={timestamp}
          classStyle="browse-items"
          itemType="media"
          linkInfo={c => `${c.type}/${c.tags_id || c.media_id}`}
          linkDisplay={c => (c.label ? c.label : c.name)}
          onSelectMedia={c => this.handleToggleAndSelectMedia(c)}
        />
      );
    }
    return (
      <div className="select-media-container">
        <SelectMediaForm initValues={whichStoredKeyword} onSearch={val => this.updateMediaQuery(val)} />
        {content}
      </div>
    );
  }
}

SelectMediaResultsContainer.propTypes = {
  intl: React.PropTypes.object.isRequired,
  handleMediaConcurrency: React.PropTypes.func.isRequired,
  handleToggleAndSelectMedia: React.PropTypes.func.isRequired,
  media: React.PropTypes.array,
  updateMediaQuerySelection: React.PropTypes.func.isRequired,
  selectedMediaQueryKeyword: React.PropTypes.string,
  selectedMediaQueryType: React.PropTypes.number,
  featured: React.PropTypes.object,
  timestamp: React.PropTypes.string,
  collectionResults: React.PropTypes.object,
  sourceResults: React.PropTypes.object,
  starredResults: React.PropTypes.object,
  selectedMedia: React.PropTypes.array,
};

const mapStateToProps = state => ({
  fetchStatus: (state.system.mediaPicker.sourceQueryResults.fetchStatus === fetchConstants.FETCH_SUCCEEDED || state.system.mediaPicker.collectionQueryResults.fetchStatus === fetchConstants.FETCH_SUCCEEDED || state.system.mediaPicker.featured.fetchStatus === fetchConstants.FETCH_SUCCEEDED) ? fetchConstants.FETCH_SUCCEEDED : fetchConstants.FETCH_INVALID,
  selectedMedia: state.system.mediaPicker.selectMedia.list,
  selectedMediaQueryType: state.system.mediaPicker.selectMediaQuery ? state.system.mediaPicker.selectMediaQuery.args.type : 0,
  selectedMediaQueryKeyword: state.system.mediaPicker.selectMediaQuery ? state.system.mediaPicker.selectMediaQuery.args.keyword : null,
  sourceResults: state.system.mediaPicker.sourceQueryResults,
  featured: state.system.mediaPicker.featured ? state.system.mediaPicker.featured : null,
  timestamp: state.system.mediaPicker.featured ? state.system.mediaPicker.featured.timestamp : null,
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
  handleMediaConcurrency: (selectedMedia) => {
    if (selectedMedia) {
      dispatch(toggleMedia(selectedMedia));
    }
  },
  handleToggleAndSelectMedia: (selectedMedia) => {
    if (selectedMedia) {
      dispatch(toggleMedia(selectedMedia));
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

