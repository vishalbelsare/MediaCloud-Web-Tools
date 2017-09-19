import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../AsyncContainer';
import { selectMedia, toggleMedia, selectMediaPickerQueryArgs, fetchMediaPickerFeaturedCollections, resetMediaPickerQueryArgs } from '../../../actions/systemActions';
import SelectMediaForm from './SelectMediaForm';
import messages from '../../../resources/messages';
import { PICK_COLLECTION, PICK_SOURCE, ADVANCED } from '../../../lib/explorerUtil';
import * as fetchConstants from '../../../lib/fetchConstants';
import composeHelpfulContainer from '../../common/HelpfulContainer';
import SelectMediaCollectionResultsContainer from './SelectMediaCollectionResultsContainer';
import SelectMediaSourceResultsContainer from './SelectMediaSourceResultsContainer';

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
    if (nextProps.previousMediaQueryKeyword !== this.props.previousMediaQueryKeyword) {
      this.updateMediaQuery({ type: nextProps.selectedMediaQueryType, mediaKeyword: nextProps.previousMediaQueryKeyword });
    }
    this.correlateSelection(nextProps);
  }
  componentWillUnmount() {
    resetMediaPickerQueryArgs();
  }
  correlateSelection(whichProps) {
    let whichList = [];
    whichList = whichProps.sourceResults;

    if (whichProps.selectedMedia && whichProps.selectedMedia.length > 0 &&
      whichList && whichList !== undefined && whichList.list.length > 0) {
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
    const { selectedMediaQueryType, selectedMediaQueryKeyword, handleMediaConcurrency, handleToggleAndSelectMedia } = this.props;
    let content = null;
    const whichMedia = {};
    whichMedia.storedKeyword = { mediaKeyword: selectedMediaQueryKeyword };
    whichMedia.fetchStatus = null;
    switch (selectedMediaQueryType) {
      case PICK_COLLECTION:
        content = (
          <SelectMediaCollectionResultsContainer
            keyword={whichMedia.storedKeyword}
            handleMediaConcurrency={handleMediaConcurrency}
            handleToggleAndSelectMedia={handleToggleAndSelectMedia}
          />
        );
        break;
      case PICK_SOURCE:
        content = <SelectMediaSourceResultsContainer keyword={whichMedia.storedKeyword} handleMediaConcurrency={handleMediaConcurrency} handleToggleAndSelectMedia={handleToggleAndSelectMedia} />;
        break;
      case ADVANCED:
        break;
      default:
        break;
    }
    return (
      <div className="select-media-container">
        <SelectMediaForm initValues={whichMedia.storedKeyword} onSearch={val => this.updateMediaQuery(val)} />
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
  previousMediaQueryKeyword: React.PropTypes.string,
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
  selectedMediaQueryKeyword: state.system.mediaPicker.selectMediaQuery ? state.system.mediaPicker.selectMediaQuery.args.mediaKeyword : null,
  previousMediaQueryKeyword: state.system.mediaPicker.sourceQueryResults.args.mediaKeyword ? state.system.mediaPicker.sourceQueryResults.args.mediaKeyword : null,
  timestamp: state.system.mediaPicker.featured ? state.system.mediaPicker.featured.timestamp : null,

});

const mapDispatchToProps = dispatch => ({
  updateMediaQuerySelection: (values) => {
    if (values) {
      dispatch(selectMediaPickerQueryArgs(values));
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

