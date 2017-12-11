import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { selectMediaPickerQueryArgs, fetchMediaPickerCollections } from '../../../../actions/systemActions';
import CollectionResultsTable from './CollectionResultsTable';
import MediaPickerSearchForm from '../MediaPickerSearchForm';
import FeaturedCollectionsContainer from './FeaturedCollectionsContainer';
import { FETCH_ONGOING } from '../../../../lib/fetchConstants';
import { PICK_COUNTRY } from '../../../../lib/explorerUtil';
import LoadingSpinner from '../../../common/LoadingSpinner';

const localMessages = {
  title: { id: 'system.mediaPicker.collections.title', defaultMessage: 'Collections matching "{name}"' },
  hintText: { id: 'system.mediaPicker.collections.hint', defaultMessage: 'Search collections by name' },
  noResults: { id: 'system.mediaPicker.collections.noResults', defaultMessage: 'No results. Try searching for issues like online news, health, blogs, conservative to see if we have collections made up of those types of sources.' },
};


class CollectionSearchResultsContainer extends React.Component {
  updateMediaQuery(values) {
    const { updateMediaQuerySelection, selectedMediaQueryType } = this.props;
    const updatedQueryObj = Object.assign({}, values, { type: selectedMediaQueryType });
    updateMediaQuerySelection(updatedQueryObj);
  }
  render() {
    const { selectedMediaQueryType, selectedMediaQueryKeyword, collectionResults, handleToggleAndSelectMedia, fetchStatus, hintTextMsg } = this.props;
    const { formatMessage } = this.props.intl;
    let content = null;
    if (fetchStatus === FETCH_ONGOING) {
      // we have to do this here to show a loading spinner when first searching (and featured collections are showing)
      content = <LoadingSpinner />;
    } else if (collectionResults && (collectionResults.list && (collectionResults.list.length > 0 || (collectionResults.args && collectionResults.args.keyword)))) {
      content = (
        <CollectionResultsTable
          title={formatMessage(localMessages.title, { name: selectedMediaQueryKeyword })}
          collections={collectionResults.list}
          handleToggleAndSelectMedia={handleToggleAndSelectMedia}
        />
      );
    } else if (selectedMediaQueryType === PICK_COUNTRY) {
      content = <FeaturedCollectionsContainer handleToggleAndSelectMedia={handleToggleAndSelectMedia} />;
    } else {
      content = <FormattedMessage {...localMessages.noResults} />;
    }
    return (
      <div>
        <MediaPickerSearchForm
          initValues={{ storedKeyword: { mediaKeyword: selectedMediaQueryKeyword } }}
          onSearch={val => this.updateMediaQuery(val)}
          hintText={formatMessage(hintTextMsg || localMessages.hintText)}
        />
        {content}
      </div>
    );
  }
}

CollectionSearchResultsContainer.propTypes = {
  // form compositional chain
  intl: PropTypes.object.isRequired,
  // from parent
  handleToggleAndSelectMedia: PropTypes.func.isRequired,
  whichTagSet: PropTypes.number,
  hintTextMsg: PropTypes.string,
  // from dispatch
  updateMediaQuerySelection: PropTypes.func.isRequired,
  // from state
  selectedMediaQueryKeyword: PropTypes.string,
  selectedMediaQueryType: PropTypes.number,
  collectionResults: PropTypes.object,
  fetchStatus: PropTypes.string,
};

const mapStateToProps = state => ({
  fetchStatus: state.system.mediaPicker.collectionQueryResults.fetchStatus,
  selectedMediaQueryType: state.system.mediaPicker.selectMediaQuery ? state.system.mediaPicker.selectMediaQuery.args.type : 0,
  selectedMediaQueryKeyword: state.system.mediaPicker.selectMediaQuery ? state.system.mediaPicker.selectMediaQuery.args.mediaKeyword : null,
  collectionResults: state.system.mediaPicker.collectionQueryResults,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  updateMediaQuerySelection: (values) => {
    if (values) {
      dispatch(selectMediaPickerQueryArgs(values));
      dispatch(fetchMediaPickerCollections({ media_keyword: values.mediaKeyword, which_set: ownProps.whichTagSet }));
    }
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      CollectionSearchResultsContainer
    )
  );

