import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { selectMediaPickerQueryArgs, fetchMediaPickerSources } from '../../../actions/systemActions';
import messages from '../../../resources/messages';
import * as fetchConstants from '../../../lib/fetchConstants';
import composeHelpfulContainer from '../../common/HelpfulContainer';
import MediaPickerWrapper from './MediaPickerWrapper';
import SelectMediaForm from './SelectMediaForm';
import LoadingSpinner from '../LoadingSpinner';

const localMessages = {
  title: { id: 'system.mediaPicker.select.title', defaultMessage: 'title' },
  intro: { id: 'system.mediaPicker.select.info',
    defaultMessage: '<p>This is an intro</p>' },
  helpTitle: { id: 'system.mediaPicker.select.help.title', defaultMessage: 'About Media' },
};


class SelectMediaResultsContainer extends React.Component {
  updateMediaQuery(values) {
    const { updateMediaQuerySelection, selectedMediaQueryType } = this.props;
    const updatedQueryObj = Object.assign({}, values, { type: selectedMediaQueryType });
    updateMediaQuerySelection(updatedQueryObj);
  }

  render() {
    const { fetchStatus, selectedMediaQueryKeyword, sourceResults, handleToggleAndSelectMedia } = this.props;
    let whichMedia = [];
    whichMedia.storedKeyword = { mediaKeyword: selectedMediaQueryKeyword };
    whichMedia.fetchStatus = null;
    let content = null;
    if (selectedMediaQueryKeyword === null || selectedMediaQueryKeyword === undefined) {
      content = 'no results';
    } else if (fetchStatus !== fetchConstants.FETCH_SUCCEEDED) {
      content = <LoadingSpinner />;
    } else if (sourceResults && (sourceResults.list && (sourceResults.list.length > 0 || (sourceResults.args && sourceResults.args.keyword)))) {
      whichMedia = sourceResults.list;
      whichMedia.storedKeyword = sourceResults.args;
      whichMedia.fetchStatus = sourceResults.fetchStatus;
      whichMedia.type = 'sources';
      content = <MediaPickerWrapper whichMedia={whichMedia} handleToggleAndSelectMedia={handleToggleAndSelectMedia} />;
    }

    return (
      <div>
        <SelectMediaForm initValues={whichMedia.storedKeyword} onSearch={val => this.updateMediaQuery(val)} />
        {content}
      </div>
    );
  }
}

SelectMediaResultsContainer.propTypes = {
  fetchStatus: React.PropTypes.string,
  handleToggleAndSelectMedia: React.PropTypes.func.isRequired,
  updateMediaQuerySelection: React.PropTypes.func.isRequired,
  selectedMediaQueryKeyword: React.PropTypes.string,
  selectedMediaQueryType: React.PropTypes.number,
  sourceResults: React.PropTypes.object,
};

const mapStateToProps = state => ({
  fetchStatus: state.system.mediaPicker.sourceQueryResults.fetchStatus === fetchConstants.FETCH_SUCCEEDED ? fetchConstants.FETCH_SUCCEEDED : fetchConstants.FETCH_INVALID,
  selectedMediaQueryType: state.system.mediaPicker.selectMediaQuery ? state.system.mediaPicker.selectMediaQuery.args.type : 0,
  selectedMediaQueryKeyword: state.system.mediaPicker.selectMediaQuery ? state.system.mediaPicker.selectMediaQuery.args.mediaKeyword : null,
  sourceResults: state.system.mediaPicker.sourceQueryResults,
});

const mapDispatchToProps = dispatch => ({
  updateMediaQuerySelection: (values) => {
    if (values) {
      dispatch(selectMediaPickerQueryArgs(values));
      dispatch(fetchMediaPickerSources(values));
    }
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

