import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { selectMedia, toggleMedia, selectMediaPickerQueryArgs, fetchMediaPickerCollections } from '../../../actions/systemActions';
import MediaPickerPreviewList from '../MediaPickerPreviewList';
import messages from '../../../resources/messages';
import * as fetchConstants from '../../../lib/fetchConstants';
import composeHelpfulContainer from '../../common/HelpfulContainer';
import LoadingSpinner from '../../common/LoadingSpinner';

const localMessages = {
  title: { id: 'system.mediaPicker.select.title', defaultMessage: 'title' },
  intro: { id: 'system.mediaPicker.select.info',
    defaultMessage: '<p>This is an intro</p>' },
  helpTitle: { id: 'system.mediaPicker.select.help.title', defaultMessage: 'About Media' },
};


class SelectMediaCollectionResultsContainer extends React.Component {
  componentWillMount() {
    this.correlateSelection(this.props);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedMediaQueryKeyword !== this.props.selectedMediaQueryKeyword) {
      this.updateMediaQuery({ type: nextProps.selectedMediaQueryType, mediaKeyword: nextProps.selectedMediaQueryKeyword });
    }
    this.correlateSelection(nextProps);
  }

  correlateSelection(whichProps) {
    let whichList = [];
    if (whichProps.collectionResults && whichProps.collectionResults.list.length > 0) {
      whichList = whichProps.collectionResults;
    } else if (whichProps.featured && whichProps.featured.list.length > 0) {
      whichList = whichProps.featured;
    }

    if (whichProps.selectedMedia && whichProps.selectedMedia.length > 0 && whichList.list && whichList.list.length > 0) {
      // update current list regardless - find matches in selected and issue select_media action
      // infinite loop though if we dont' stop...
      whichProps.selectedMedia.map(s => (
        whichList.list.map((v) => {
          if ((s.tags_id === v.id || s.id === v.id) && !v.selected) {
            this.props.handleMediaConcurrency(s); // update if
            return true;
          }
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
    const { timestamp, selectedMediaQueryKeyword, collectionResults, featured } = this.props;
    let content = null;
    let whichMedia = {};
    whichMedia.storedKeyword = { mediaKeyword: selectedMediaQueryKeyword };
    whichMedia.FetchStatus = null;
    if (collectionResults && (collectionResults.list && (collectionResults.list.length > 0 || (collectionResults.args && collectionResults.args.keyword)))) {
      whichMedia = collectionResults.list; // since this is the default, check keyword, otherwise it'll be empty
      whichMedia.storedKeyword = collectionResults.args;
      whichMedia.fetchStatus = collectionResults.fetchStatus;
    } else {
      whichMedia = featured.list;
      whichMedia.fetchStatus = featured.fetchStatus;
    }
    whichMedia.type = 'collections';

    if (whichMedia.storedKeyword !== null && (whichMedia.fetchStatus === null || whichMedia.fetchStatus === fetchConstants.FETCH_ONGOING)) {
      content = <LoadingSpinner />;
    } else if (whichMedia && whichMedia.length > 0) {
      content = (
        <MediaPickerPreviewList
          items={whichMedia}
          timestamp={timestamp}
          classStyle="browse-items"
          itemType="media"
          linkInfo={c => `${whichMedia.type}/${c.tags_id || c.media_id}`}
          linkDisplay={c => (c.label ? c.label : c.name)}
          onSelectMedia={c => this.handleToggleAndSelectMedia(c)}
        />
      );
    }
    return content;
  }
}

SelectMediaCollectionResultsContainer.propTypes = {
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
  selectedMedia: React.PropTypes.array,
};

const mapStateToProps = state => ({
  fetchStatus: (state.system.mediaPicker.sourceQueryResults.fetchStatus === fetchConstants.FETCH_SUCCEEDED || state.system.mediaPicker.collectionQueryResults.fetchStatus === fetchConstants.FETCH_SUCCEEDED || state.system.mediaPicker.featured.fetchStatus === fetchConstants.FETCH_SUCCEEDED) ? fetchConstants.FETCH_SUCCEEDED : fetchConstants.FETCH_INVALID,
  selectedMedia: state.system.mediaPicker.selectMedia.list,
  selectedMediaQueryType: state.system.mediaPicker.selectMediaQuery ? state.system.mediaPicker.selectMediaQuery.args.type : 0,
  selectedMediaQueryKeyword: state.system.mediaPicker.selectMediaQuery ? state.system.mediaPicker.selectMediaQuery.args.mediaKeyword : null,
  featured: state.system.mediaPicker.featured ? state.system.mediaPicker.featured : null,
  timestamp: state.system.mediaPicker.featured ? state.system.mediaPicker.featured.timestamp : null,
  collectionResults: state.system.mediaPicker.collectionQueryResults,
});

const mapDispatchToProps = dispatch => ({
  updateMediaQuerySelection: (values) => {
    if (values) {
      dispatch(selectMediaPickerQueryArgs(values));
      dispatch(fetchMediaPickerCollections(values));
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
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeHelpfulContainer(localMessages.helpTitle, [localMessages.intro, messages.mediaPickerHelpText])(
        SelectMediaCollectionResultsContainer
      )
    )
  );

