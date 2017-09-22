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
    // const { handleMediaConcurrency } = this.props;
    if (nextProps.selectedMediaQueryType !== this.props.selectedMediaQueryType) {
      this.updateMediaQuery({ type: nextProps.selectedMediaQueryType });
    }
    if (nextProps.selectedMedia !== this.props.selectedMedia) {
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
    // updated what has been un/selected - make sure results are in sync with selectedMedia store
    if (whichProps.selectedMedia && whichProps.selectedMedia.length > 0 &&
      whichList && whichList !== undefined && whichList.list && whichList.list.length > 0) {
      // deselect/ turn everything off
      whichList.list.filter((m) => {
        if (m.selected) {
          this.props.toggleConcurrency(m, false);
        }
        return m;
      });

      // select/ turn on what should be
      whichList.list.map(v => (
        whichProps.selectedMedia.filter((s) => { // if selected in selectedMedia and and not updated in results yet
          if ((s.tags_id === v.id || s.id === v.id) && !v.selected) {
            this.props.toggleConcurrency(v, true); // turn on selection/disable add
            return null;
          }
          return v;
        })
      ));
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
          <SelectMediaCollectionResultsContainer
            handleMediaConcurrency={toggleConcurrency}
            handleToggleAndSelectMedia={handleToggleAndSelectMedia}
          />
        );
        break;
      case PICK_SOURCE:
        content = <SelectMediaSourceResultsContainer handleMediaConcurrency={toggleConcurrency} handleToggleAndSelectMedia={handleToggleAndSelectMedia} />;
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
  toggleConcurrency: React.PropTypes.func.isRequired,
  handleToggleAndSelectMedia: React.PropTypes.func.isRequired,
  updateMediaQuerySelection: React.PropTypes.func.isRequired,
  selectedMediaQueryType: React.PropTypes.number,
  resetComponents: React.PropTypes.func.isRequired,
  featured: React.PropTypes.object,
  collectionResults: React.PropTypes.object,
  sourceResults: React.PropTypes.object,
  selectedMedia: React.PropTypes.array,
};

const mapStateToProps = state => ({
  fetchStatus: (state.system.mediaPicker.sourceQueryResults.fetchStatus === fetchConstants.FETCH_SUCCEEDED || state.system.mediaPicker.collectionQueryResults.fetchStatus === fetchConstants.FETCH_SUCCEEDED || state.system.mediaPicker.featured.fetchStatus === fetchConstants.FETCH_SUCCEEDED) ? fetchConstants.FETCH_SUCCEEDED : fetchConstants.FETCH_INVALID,
  selectedMedia: state.system.mediaPicker.selectMedia.list,
  selectedMediaQueryType: state.system.mediaPicker.selectMediaQuery ? state.system.mediaPicker.selectMediaQuery.args.type : 0,
  timestamp: state.system.mediaPicker.featured ? state.system.mediaPicker.featured.timestamp : null,
  collectionResults: state.system.mediaPicker.collectionQueryResults,
  featured: state.system.mediaPicker.featured ? state.system.mediaPicker.featured : null,
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
        SelectMediaResultsContainer
      )
    )
  );

