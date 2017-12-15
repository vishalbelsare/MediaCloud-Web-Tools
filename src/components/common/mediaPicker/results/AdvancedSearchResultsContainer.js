import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { selectMediaPickerQueryArgs, fetchMediaPickerAdvancedSearch } from '../../../../actions/systemActions';
import CollectionSearchResultsContainer from './CollectionSearchResultsContainer';
import AdvancedMediaPickerSearchForm from '../AdvancedMediaPickerSearchForm';

const localMessages = {
  title: { id: 'system.mediaPicker.collections.title', defaultMessage: 'Collections matching "{name}"' },
  countrySearchHintText: { id: 'system.mediaPicker.collections.hint', defaultMessage: 'Search by Country or State name' },
  noResults: { id: 'system.mediaPicker.collections.noResults', defaultMessage: 'No results. Try searching for issues like online news, health, blogs, conservative to see if we have collections made up of those types of sources.' },
};


class AdvancedSearchResultsContainer extends React.Component {
  updateMediaQuery(values) {
    const { updateMediaQuerySelection, selectedMediaQueryType } = this.props;
    const updatedQueryObj = Object.assign({}, values, { type: selectedMediaQueryType });
    updateMediaQuerySelection(updatedQueryObj);
  }
  render() {
    const { selectedMediaQueryType, selectedMediaQueryKeyword, collectionResults, handleToggleAndSelectMedia, fetchCountryStatus } = this.props;
    const { formatMessage } = this.props.intl;

    const initCollections = <AdvancedMediaPickerSearchForm handleToggleAndSelectMedia={handleToggleAndSelectMedia} />;
    return (
      <div>
        <CollectionSearchResultsContainer
          fetchStatus={fetchCountryStatus}
          initCollections={initCollections}
          handleToggleAndSelectMedia={handleToggleAndSelectMedia}
          selectedMediaQueryType={selectedMediaQueryType}
          selectedMediaQueryKeyword={selectedMediaQueryKeyword}
          collectionResults={collectionResults}
          initValues={{ storedKeyword: { mediaKeyword: selectedMediaQueryKeyword } }}
          onSearch={val => this.updateMediaQuery(val)}
          hintText={formatMessage(localMessages.countrySearchHintText)}
        />
      </div>
    );
  }
}

AdvancedSearchResultsContainer.propTypes = {
  // form compositional chain
  intl: PropTypes.object.isRequired,
  // from parent
  handleToggleAndSelectMedia: PropTypes.func.isRequired,
  whichTagSet: PropTypes.number,
  // from dispatch
  updateMediaQuerySelection: PropTypes.func.isRequired,
  // from state
  selectedMediaQueryKeyword: PropTypes.string,
  selectedMediaQueryType: PropTypes.number,
  collectionResults: PropTypes.object,
  fetchCountryStatus: PropTypes.string,
};

const mapStateToProps = state => ({
  fetchAdvancedStatus: state.system.mediaPicker.advancedQueryResults.fetchStatus,
  selectedMediaQueryType: state.system.mediaPicker.selectMediaQuery ? state.system.mediaPicker.selectMediaQuery.args.type : 0,
  selectedMediaQueryKeyword: state.system.mediaPicker.selectMediaQuery ? state.system.mediaPicker.selectMediaQuery.args.mediaKeyword : null,
  collectionResults: state.system.mediaPicker.advancedQueryResults,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  updateMediaQuerySelection: (values) => {
    if (values) {
      dispatch(selectMediaPickerQueryArgs(values));
      dispatch(fetchMediaPickerAdvancedSearch({ media_keyword: values.mediaKeyword, which_set: ownProps.whichTagSet }));
    }
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      AdvancedSearchResultsContainer
    )
  );

