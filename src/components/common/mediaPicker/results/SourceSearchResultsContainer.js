import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { selectMediaPickerQueryArgs, fetchMediaPickerSources } from '../../../../actions/systemActions';
import { FETCH_ONGOING } from '../../../../lib/fetchConstants';
import SourceResultsTable from './SourceResultsTable';
import MediaPickerSearchForm from '../MediaPickerSearchForm';
import LoadingSpinner from '../../LoadingSpinner';

const localMessages = {
  title: { id: 'system.mediaPicker.sources.title', defaultMessage: 'Sources matching "{name}"' },
  hintText: { id: 'system.mediaPicker.sources.hint', defaultMessage: 'Search sources by name or url' },
  noResults: { id: 'system.mediaPicker.sources.noResults', defaultMessage: 'No results. Try searching for the name or URL of a specific source to see if we cover it, like Washington Post, Hindustan, or guardian.co.uk.' },
};


class SourceSearchResultsContainer extends React.Component {
  updateMediaQuery(values) {
    const { updateMediaQuerySelection, selectedMediaQueryType } = this.props;
    const updatedQueryObj = Object.assign({}, values, { type: selectedMediaQueryType });
    updateMediaQuerySelection(updatedQueryObj);
  }

  render() {
    const { fetchStatus, selectedMediaQueryKeyword, sourceResults, handleToggleAndSelectMedia } = this.props;
    const { formatMessage } = this.props.intl;
    let content = null;
    if (fetchStatus === FETCH_ONGOING) {
      content = <LoadingSpinner />;
    } else if (sourceResults && (sourceResults.list && (sourceResults.list.length > 0 || (sourceResults.args && sourceResults.args.keyword)))) {
      content = (
        <SourceResultsTable
          title={formatMessage(localMessages.title, { name: selectedMediaQueryKeyword })}
          sources={sourceResults.list}
          handleToggleAndSelectMedia={handleToggleAndSelectMedia}
        />
      );
    } else {
      content = <FormattedMessage {...localMessages.noResults} />;
    }

    return (
      <div>
        <MediaPickerSearchForm
          initValues={{ storedKeyword: { mediaKeyword: selectedMediaQueryKeyword } }}
          onSearch={val => this.updateMediaQuery(val)}
          hintText={formatMessage(localMessages.hintText)}
        />
        {content}
      </div>
    );
  }
}

SourceSearchResultsContainer.propTypes = {
  intl: PropTypes.object.isRequired,
  fetchStatus: PropTypes.string,
  handleToggleAndSelectMedia: PropTypes.func.isRequired,
  updateMediaQuerySelection: PropTypes.func.isRequired,
  selectedMediaQueryKeyword: PropTypes.string,
  selectedMediaQueryType: PropTypes.number,
  sourceResults: PropTypes.object,
};

const mapStateToProps = state => ({
  fetchStatus: state.system.mediaPicker.sourceQueryResults.fetchStatus,
  selectedMediaQueryType: state.system.mediaPicker.selectMediaQuery ? state.system.mediaPicker.selectMediaQuery.args.type : 0,
  selectedMediaQueryKeyword: state.system.mediaPicker.selectMediaQuery ? state.system.mediaPicker.selectMediaQuery.args.mediaKeyword : null,
  sourceResults: state.system.mediaPicker.sourceQueryResults,
});

const mapDispatchToProps = dispatch => ({
  updateMediaQuerySelection: (values) => {
    if (values) {
      dispatch(selectMediaPickerQueryArgs(values));
      dispatch(fetchMediaPickerSources({ media_keyword: values.mediaKeyword }));
    }
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      SourceSearchResultsContainer
    )
  );

