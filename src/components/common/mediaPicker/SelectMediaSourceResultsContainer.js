import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { selectMediaPickerQueryArgs, fetchMediaPickerSources } from '../../../actions/systemActions';
import * as fetchConstants from '../../../lib/fetchConstants';
import MediaPickerWrapper from './MediaPickerWrapper';
import SelectMediaForm from './SelectMediaForm';
import LoadingSpinner from '../LoadingSpinner';

const localMessages = {
  title: { id: 'system.mediaPicker.sources.title', defaultMessage: 'Sources matching "{name}"' },
  hintText: { id: 'system.mediaPicker.sources.hint', defaultMessage: 'Search sources by name or url' },
};


class SelectMediaResultsContainer extends React.Component {
  updateMediaQuery(values) {
    const { updateMediaQuerySelection, selectedMediaQueryType } = this.props;
    const updatedQueryObj = Object.assign({}, values, { type: selectedMediaQueryType });
    updateMediaQuerySelection(updatedQueryObj);
  }

  render() {
    const { fetchStatus, selectedMediaQueryKeyword, sourceResults, handleToggleAndSelectMedia } = this.props;
    const { formatMessage } = this.props.intl;
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
      content = (
        <MediaPickerWrapper
          title={formatMessage(localMessages.title, { name: whichMedia.storedKeyword.mediaKeyword })}
          whichMedia={whichMedia}
          handleToggleAndSelectMedia={handleToggleAndSelectMedia}
        />
      );
    }

    return (
      <div>
        <SelectMediaForm
          initValues={whichMedia}
          onSearch={val => this.updateMediaQuery(val)}
          hintText={formatMessage(localMessages.hintText)}
        />
        {content}
      </div>
    );
  }
}

SelectMediaResultsContainer.propTypes = {
  intl: React.PropTypes.object.isRequired,
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
      SelectMediaResultsContainer
    )
  );

