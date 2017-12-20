import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { selectMediaPickerQueryArgs, fetchMediaPickerSources } from '../../../../actions/systemActions';
import { FETCH_ONGOING } from '../../../../lib/fetchConstants';
import SourceResultsTable from './SourceResultsTable';
import AdvancedMediaPickerSearchForm from '../AdvancedMediaPickerSearchForm';
import MediaPickerSearchForm from '../MediaPickerSearchForm';
import LoadingSpinner from '../../LoadingSpinner';
import { notEmptyString } from '../../../../lib/formValidators';

const localMessages = {
  title: { id: 'system.mediaPicker.sources.title', defaultMessage: 'Sources matching "{name}"' },
  hintText: { id: 'system.mediaPicker.sources.hint', defaultMessage: 'Search sources by name or url' },
  noResults: { id: 'system.mediaPicker.sources.noResults', defaultMessage: 'No results. Try searching for the name or URL of a specific source to see if we cover it, like Washington Post, Hindustan, or guardian.co.uk.' },
  showAdvancedOptions: { id: 'system.mediaPicker.sources.showAdvancedOptions', defaultMessage: 'Show Advanced Options' },
  hideAdvancedOptions: { id: 'system.mediaPicker.sources.hideAdvancedOptions', defaultMessage: 'Hide Advanced Options' },
};


class SourceSearchResultsContainer extends React.Component {
  state = {
    showAdvancedOptions: false,
  }
  toggleAdvancedOptions = () => {
    this.setState({ showAdvancedOptions: !this.state.showAdvancedOptions });
  }

  updateMediaQuery(values) {
    const { updateMediaQuerySelection, selectedMediaQueryType } = this.props;
    const updatedQueryObj = Object.assign({}, values, { type: selectedMediaQueryType });
    updateMediaQuerySelection(updatedQueryObj);
  }

  render() {
    const { fetchStatus, selectedMediaQueryKeyword, sourceResults, handleToggleAndSelectMedia } = this.props;
    const { formatMessage } = this.props.intl;
    let content = null;
    let resultContent = null;
    if (this.state.showAdvancedOptions) {
      content = (
        <div>
          <a onTouchTap={this.toggleAdvancedOptions} ><FormattedMessage {...localMessages.hideAdvancedOptions} /></a>
          <AdvancedMediaPickerSearchForm
            initValues={{ storedKeyword: { mediaKeyword: selectedMediaQueryKeyword } }}
            onSearch={val => this.updateMediaQuery(val)}
            hintText={formatMessage(localMessages.hintText)}
          />
        </div>
      );
    } else {
      content = (
        <div>
          <a onTouchTap={this.toggleAdvancedOptions} ><FormattedMessage {...localMessages.showAdvancedOptions} /></a>
          <MediaPickerSearchForm
            initValues={{ storedKeyword: { mediaKeyword: selectedMediaQueryKeyword } }}
            onSearch={val => this.updateMediaQuery(val)}
            hintText={formatMessage(localMessages.hintText)}
          />
        </div>
      );
    }
    if (fetchStatus === FETCH_ONGOING) {
      resultContent = <LoadingSpinner />;
    } else if (sourceResults && (sourceResults.list && (sourceResults.list.length > 0 || (sourceResults.args && sourceResults.args.media_keyword)))) {
      resultContent = (
        <SourceResultsTable
          title={formatMessage(localMessages.title, { name: selectedMediaQueryKeyword })}
          sources={sourceResults.list}
          handleToggleAndSelectMedia={handleToggleAndSelectMedia}
        />
      );
    } else {
      resultContent = <FormattedMessage {...localMessages.noResults} />;
    }
    return (
      <div>
        {content}
        {resultContent}
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
    if (values && notEmptyString(values.mediaKeyword)) {
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

