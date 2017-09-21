import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { selectMedia, toggleMedia, selectMediaPickerQueryArgs, resetMediaPickerQueryArgs, resetMediaPickerSources, resetMediaPickerCollections } from '../../../actions/systemActions';
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
    if (nextProps.selectedMediaQueryType !== this.props.selectedMediaQueryType) {
      this.updateMediaQuery({ type: nextProps.selectedMediaQueryType });
    }
    this.correlateSelection(nextProps);
  }
  componentWillUnmount() {
    const { resetComponents } = this.props;
    resetComponents();
  }
  correlateSelection(whichProps) {
    let whichList = [];
    whichList = whichProps.sourceResults;

    // updated what has been selected
    if (whichProps.selectedMedia && whichProps.selectedMedia.length > 0 &&
      whichList && whichList !== undefined && whichList.list.length > 0) {
      // update current list regardless - find matches in selected and issue select_media action
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
    const { updateMediaQuerySelection } = this.props;
    updateMediaQuerySelection(values);
  }
  handleToggleAndSelectMedia(media) {
    const { handleToggleAndSelectMedia } = this.props;
    handleToggleAndSelectMedia(media);
  }

  render() {
    const { selectedMediaQueryType, handleMediaConcurrency, handleToggleAndSelectMedia } = this.props;
    let content = null;
    const whichMedia = {};
    whichMedia.fetchStatus = null;
    switch (selectedMediaQueryType) {
      case PICK_COLLECTION:
        content = (
          <SelectMediaCollectionResultsContainer
            handleMediaConcurrency={handleMediaConcurrency}
            handleToggleAndSelectMedia={handleToggleAndSelectMedia}
          />
        );
        break;
      case PICK_SOURCE:
        content = <SelectMediaSourceResultsContainer handleMediaConcurrency={handleMediaConcurrency} handleToggleAndSelectMedia={handleToggleAndSelectMedia} />;
        break;
      case ADVANCED:
        break;
      default:
        break;
    }
    return (
      <div className="select-media-container">
        {content}
      </div>
    );
  }
}

SelectMediaResultsContainer.propTypes = {
  intl: React.PropTypes.object.isRequired,
  handleMediaConcurrency: React.PropTypes.func.isRequired,
  handleToggleAndSelectMedia: React.PropTypes.func.isRequired,
  updateMediaQuerySelection: React.PropTypes.func.isRequired,
  selectedMediaQueryType: React.PropTypes.number,
  resetComponents: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: (state.system.mediaPicker.sourceQueryResults.fetchStatus === fetchConstants.FETCH_SUCCEEDED || state.system.mediaPicker.collectionQueryResults.fetchStatus === fetchConstants.FETCH_SUCCEEDED || state.system.mediaPicker.featured.fetchStatus === fetchConstants.FETCH_SUCCEEDED) ? fetchConstants.FETCH_SUCCEEDED : fetchConstants.FETCH_INVALID,
  selectedMedia: state.system.mediaPicker.selectMedia.list,
  selectedMediaQueryType: state.system.mediaPicker.selectMediaQuery ? state.system.mediaPicker.selectMediaQuery.args.type : 0,
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
      dispatch(toggleMedia(selectedMedia)); // TODO come back to this.. can we turn this into one call
      dispatch(selectMedia(selectedMedia)); // disable MediaPickerPreviewList button too
    }
  },
  resetComponents: () => {
    dispatch(resetMediaPickerQueryArgs());
    dispatch(resetMediaPickerSources());
    dispatch(resetMediaPickerCollections());
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeHelpfulContainer(localMessages.helpTitle, [localMessages.intro, messages.mediaPickerHelpText])(
        SelectMediaResultsContainer
      )
    )
  );

