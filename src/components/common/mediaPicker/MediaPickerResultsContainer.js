import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { selectMedia, toggleMedia, selectMediaPickerQueryArgs, resetMediaPickerQueryArgs, resetMediaPickerSources, resetMediaPickerCollections } from '../../../actions/systemActions';
import messages from '../../../resources/messages';
import { PICK_COLLECTION, PICK_SOURCE, ADVANCED } from '../../../lib/explorerUtil';
import * as fetchConstants from '../../../lib/fetchConstants';
import composeHelpfulContainer from '../../common/HelpfulContainer';
import CollectionSearchResultsContainer from './results/CollectionSearchResultsContainer';
import SourceSearchResultsContainer from './results/SourceSearchResultsContainer';

const localMessages = {
  title: { id: 'system.mediaPicker.select.title', defaultMessage: 'title' },
  intro: { id: 'system.mediaPicker.select.info',
    defaultMessage: '<p>This is an intro</p>' },
  helpTitle: { id: 'system.mediaPicker.select.help.title', defaultMessage: 'About Media' },
};


class MediaPickerResultsContainer extends React.Component {
  componentWillMount() {
    this.correlateSelection(this.props);
  }
  componentWillReceiveProps(nextProps) {
    // const { handleMediaConcurrency } = this.props;
    if (nextProps.selectedMediaQueryType !== this.props.selectedMediaQueryType) {
      this.updateMediaQuery({ type: nextProps.selectedMediaQueryType });
    }
    if (nextProps.selectedMedia !== this.props.selectedMedia ||
      // because featured collections has an async call, we either compare selected to featured here, or do something else
      // if the results have changed from a keyword entry, we need to update the UI
      (nextProps.sourceResults && nextProps.sourceResults.lastFetchSuccess !== this.props.sourceResults.lastFetchSuccess) ||
      (nextProps.featured && nextProps.featured.lastFetchSuccess !== this.props.featured.lastFetchSuccess)) {
      this.correlateSelection(nextProps);
    }
  }
  componentWillUnmount() {
    const { resetComponents } = this.props;
    resetComponents();
  }

  correlateSelection(whichProps) {
    let whichList = [];

    switch (whichProps.selectedMediaQueryType) {
      case PICK_COLLECTION:
        if (whichProps.selectedMediaQueryKeyword !== null && whichProps.selectedMediaQueryKeyword !== undefined) {
          whichList = whichProps.collectionResults;
        } else {
          whichList = whichProps.featured;
        }
        break;
      case PICK_SOURCE:
        whichList = whichProps.sourceResults;
        break;
      default:
        break;
    }
    // if selected media has changed, update current results
    if (whichProps.selectedMedia && whichProps.selectedMedia.length > 0 &&
      // we can't be sure we have received results yet
      whichList.list && whichList.list.length > 0) {
      // sync up selectedMedia and push to result sets.
      whichList.list.map((m) => {
        const mediaIndex = whichProps.selectedMedia.findIndex(q => q.id === m.id);
        if (mediaIndex < 0) {
          this.props.toggleConcurrency(m, false);
        } else if (mediaIndex >= 0) {
          this.props.toggleConcurrency(m, true);
        }
        return m;
      });
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
    const { selectedMediaQueryType, toggleConcurrency, handleToggleAndSelectMedia } = this.props;
    let content = null;
    const whichMedia = {};
    whichMedia.fetchStatus = null;
    switch (selectedMediaQueryType) {
      case PICK_COLLECTION:
        content = (
          <CollectionSearchResultsContainer
            handleMediaConcurrency={toggleConcurrency}
            handleToggleAndSelectMedia={handleToggleAndSelectMedia}
          />
        );
        break;
      case PICK_SOURCE:
        content = <SourceSearchResultsContainer handleMediaConcurrency={toggleConcurrency} handleToggleAndSelectMedia={handleToggleAndSelectMedia} />;
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

MediaPickerResultsContainer.propTypes = {
  intl: PropTypes.object.isRequired,
  toggleConcurrency: PropTypes.func.isRequired,
  handleToggleAndSelectMedia: PropTypes.func.isRequired,
  updateMediaQuerySelection: PropTypes.func.isRequired,
  selectedMediaQueryType: PropTypes.number,
  resetComponents: PropTypes.func.isRequired,
  featured: PropTypes.object,
  collectionResults: PropTypes.object,
  sourceResults: PropTypes.object,
  selectedMedia: PropTypes.array,
};

const mapStateToProps = state => ({
  fetchStatus: (state.system.mediaPicker.sourceQueryResults.fetchStatus === fetchConstants.FETCH_SUCCEEDED || state.system.mediaPicker.collectionQueryResults.fetchStatus === fetchConstants.FETCH_SUCCEEDED || state.system.mediaPicker.featured.fetchStatus === fetchConstants.FETCH_SUCCEEDED) ? fetchConstants.FETCH_SUCCEEDED : fetchConstants.FETCH_INVALID,
  selectedMedia: state.system.mediaPicker.selectMedia.list,
  selectedMediaQueryType: state.system.mediaPicker.selectMediaQuery ? state.system.mediaPicker.selectMediaQuery.args.type : 0,
  timestamp: state.system.mediaPicker.featured ? state.system.mediaPicker.featured.timestamp : null,
  collectionResults: state.system.mediaPicker.collectionQueryResults,
  featured: state.system.mediaPicker.featured ? state.system.mediaPicker.featured : null,
  sourceResults: state.system.mediaPicker.sourceQueryResults,
});

const mapDispatchToProps = dispatch => ({
  updateMediaQuerySelection: (values) => {
    if (values) {
      dispatch(selectMediaPickerQueryArgs(values));
    }
  },
  toggleConcurrency: (selectedMedia, onOrOff) => {
    if (selectedMedia) {
      dispatch(toggleMedia({ selectedMedia, setSelected: onOrOff })); // for search results selectedMedia >> results
    }
  },
  handleToggleAndSelectMedia: (selectedMedia) => {
    if (selectedMedia) {
      // dispatch(toggleMedia(selectedMedia));
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
        MediaPickerResultsContainer
      )
    )
  );

