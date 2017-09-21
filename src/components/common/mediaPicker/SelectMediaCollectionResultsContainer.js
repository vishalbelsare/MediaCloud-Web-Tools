import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { selectMediaPickerQueryArgs, fetchMediaPickerCollections } from '../../../actions/systemActions';
import MediaPickerWrapper from './MediaPickerWrapper';
import messages from '../../../resources/messages';
import composeHelpfulContainer from '../../common/HelpfulContainer';
import SelectMediaForm from './SelectMediaForm';
import SelectMediaFeaturedAsyncContainer from './SelectMediaFeaturedAsyncContainer';

const localMessages = {
  title: { id: 'system.mediaPicker.select.title', defaultMessage: 'title' },
  intro: { id: 'system.mediaPicker.select.info',
    defaultMessage: '<p>This is an intro</p>' },
  helpTitle: { id: 'system.mediaPicker.select.help.title', defaultMessage: 'About Media' },
};


class SelectMediaCollectionResultsContainer extends React.Component {
  updateMediaQuery(values) {
    const { updateMediaQuerySelection, selectedMediaQueryType } = this.props;
    const updatedQueryObj = Object.assign({}, values, { type: selectedMediaQueryType });
    updateMediaQuerySelection(updatedQueryObj);
  }
  render() {
    const { selectedMediaQueryKeyword, collectionResults, handleToggleAndSelectMedia } = this.props;
    let whichMedia = [];
    let content = null;
    whichMedia.storedKeyword = { mediaKeyword: selectedMediaQueryKeyword };
    whichMedia.fetchStatus = null;
    whichMedia.type = 'collections';
    if (collectionResults && (collectionResults.list && (collectionResults.list.length > 0 || (collectionResults.args && collectionResults.args.keyword)))) {
      whichMedia = collectionResults.list; // since this is the default, check keyword, otherwise it'll be empty
      whichMedia.storedKeyword = collectionResults.args;
      whichMedia.fetchStatus = collectionResults.fetchStatus;
      content = <MediaPickerWrapper whichMedia={whichMedia} handleToggleAndSelectMedia={handleToggleAndSelectMedia} />;
    } else {
      content = <SelectMediaFeaturedAsyncContainer handleToggleAndSelectMedia={handleToggleAndSelectMedia} />;
    }
    return (
      <div>
        <SelectMediaForm initValues={whichMedia.storedKeyword} onSearch={val => this.updateMediaQuery(val)} />
        {content}
      </div>
    );
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
  fetchStatus: state.system.mediaPicker.collectionQueryResults.fetchStatus,
  selectedMediaQueryType: state.system.mediaPicker.selectMediaQuery ? state.system.mediaPicker.selectMediaQuery.args.type : 0,
  selectedMediaQueryKeyword: state.system.mediaPicker.selectMediaQuery ? state.system.mediaPicker.selectMediaQuery.args.mediaKeyword : null,
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

