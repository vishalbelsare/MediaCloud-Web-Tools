import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { selectMediaPickerQueryArgs, fetchMediaPickerCollections } from '../../../../actions/systemActions';
import CollectionResultsTable from './CollectionResultsTable';
import MediaPickerSearchForm from '../MediaPickerSearchForm';
import FeaturedCollectionsContainer from './FeaturedCollectionsContainer';
import { FETCH_ONGOING } from '../../../../lib/fetchConstants';

import LoadingSpinner from '../../../common/LoadingSpinner';

const localMessages = {
  title: { id: 'system.mediaPicker.collections.title', defaultMessage: 'Collections matching "{name}"' },
  hintText: { id: 'system.mediaPicker.collections.hint', defaultMessage: 'Search collections by name' },
};


class CollectionSearchResultsContainer extends React.Component {
  updateMediaQuery(values) {
    const { updateMediaQuerySelection, selectedMediaQueryType } = this.props;
    const updatedQueryObj = Object.assign({}, values, { type: selectedMediaQueryType });
    updateMediaQuerySelection(updatedQueryObj);
  }
  render() {
    const { selectedMediaQueryKeyword, collectionResults, handleToggleAndSelectMedia, fetchStatus } = this.props;
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
    } else {
      content = <FeaturedCollectionsContainer handleToggleAndSelectMedia={handleToggleAndSelectMedia} />;
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

CollectionSearchResultsContainer.propTypes = {
  intl: PropTypes.object.isRequired,
  handleToggleAndSelectMedia: PropTypes.func.isRequired,
  updateMediaQuerySelection: PropTypes.func.isRequired,
  selectedMediaQueryKeyword: PropTypes.string,
  selectedMediaQueryType: PropTypes.number,
  featured: PropTypes.object,
  collectionResults: PropTypes.object,
  fetchStatus: PropTypes.string,
  whichTagSet: PropTypes.number,
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

