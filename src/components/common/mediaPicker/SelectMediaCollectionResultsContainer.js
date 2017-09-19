import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { selectMediaPickerQueryArgs, fetchMediaPickerCollections, resetMediaPickerCollections } from '../../../actions/systemActions';
import MediaPickerWrapper from './MediaPickerWrapper';
import messages from '../../../resources/messages';
import * as fetchConstants from '../../../lib/fetchConstants';
import composeHelpfulContainer from '../../common/HelpfulContainer';

const localMessages = {
  title: { id: 'system.mediaPicker.select.title', defaultMessage: 'title' },
  intro: { id: 'system.mediaPicker.select.info',
    defaultMessage: '<p>This is an intro</p>' },
  helpTitle: { id: 'system.mediaPicker.select.help.title', defaultMessage: 'About Media' },
};


class SelectMediaCollectionResultsContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedMediaQueryKeyword !== this.props.selectedMediaQueryKeyword) {
      this.updateMediaQuery({ type: nextProps.selectedMediaQueryType, mediaKeyword: nextProps.selectedMediaQueryKeyword });
    }
  }
  componentWillUnmount() {
    resetMediaPickerCollections();
  }
  updateMediaQuery(values) {
    const { updateMediaQuerySelection, selectedMediaQueryType } = this.props;
    const updatedQueryObj = Object.assign({}, values, { type: selectedMediaQueryType });
    updateMediaQuerySelection(updatedQueryObj);
  }
  render() {
    const { selectedMediaQueryKeyword, collectionResults, featured, handleToggleAndSelectMedia } = this.props;
    let whichMedia = [];
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

    return <MediaPickerWrapper whichMedia={whichMedia} handleToggleAndSelectMedia={handleToggleAndSelectMedia} />;
  }
}

SelectMediaCollectionResultsContainer.propTypes = {
  handleToggleAndSelectMedia: React.PropTypes.func.isRequired,
  updateMediaQuerySelection: React.PropTypes.func.isRequired,
  selectedMediaQueryKeyword: React.PropTypes.string,
  selectedMediaQueryType: React.PropTypes.number,
  featured: React.PropTypes.object,
  collectionResults: React.PropTypes.object,
};

const mapStateToProps = state => ({
  fetchStatus: state.system.mediaPicker.collectionQueryResults.fetchStatus === (fetchConstants.FETCH_SUCCEEDED || state.system.mediaPicker.featured.fetchStatus === fetchConstants.FETCH_SUCCEEDED) ? fetchConstants.FETCH_SUCCEEDED : fetchConstants.FETCH_INVALID,
  selectedMediaQueryType: state.system.mediaPicker.selectMediaQuery ? state.system.mediaPicker.selectMediaQuery.args.type : 0,
  selectedMediaQueryKeyword: state.system.mediaPicker.selectMediaQuery ? state.system.mediaPicker.selectMediaQuery.args.mediaKeyword : null,
  featured: state.system.mediaPicker.featured ? state.system.mediaPicker.featured : null,
  collectionResults: state.system.mediaPicker.collectionQueryResults,
});

const mapDispatchToProps = dispatch => ({
  updateMediaQuerySelection: (values) => {
    if (values) {
      dispatch(selectMediaPickerQueryArgs(values));
      dispatch(fetchMediaPickerCollections(values));
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

