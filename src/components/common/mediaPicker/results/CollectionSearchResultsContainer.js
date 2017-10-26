import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { selectMediaPickerQueryArgs, fetchMediaPickerCollections } from '../../../../actions/systemActions';
import SearchResultsTable from './SearchResultsTable';
import MediaPickerSearchForm from '../MediaPickerSearchForm';
import FeaturedCollectionsContainer from './FeaturedCollectionsContainer';

const localMessages = {
  title: { id: 'system.mediaPicker.collections.title', defaultMessage: 'Collections matching "{name}"' },
  hintText: { id: 'system.mediaPicker.collections.hint', defaultMessage: 'Search collections by name' },
};


class CollectionSearchRresultsContainer extends React.Component {
  updateMediaQuery(values) {
    const { updateMediaQuerySelection, selectedMediaQueryType } = this.props;
    const updatedQueryObj = Object.assign({}, values, { type: selectedMediaQueryType });
    updateMediaQuerySelection(updatedQueryObj);
  }
  render() {
    const { selectedMediaQueryKeyword, collectionResults, handleToggleAndSelectMedia } = this.props;
    const { formatMessage } = this.props.intl;
    let whichMedia = [];
    let content = null;
    whichMedia.storedKeyword = { mediaKeyword: selectedMediaQueryKeyword };
    whichMedia.fetchStatus = null;
    whichMedia.type = 'collections';
    if (collectionResults && (collectionResults.list && (collectionResults.list.length > 0 || (collectionResults.args && collectionResults.args.keyword)))) {
      whichMedia = collectionResults.list; // since this is the default, check keyword, otherwise it'll be empty
      whichMedia.storedKeyword = collectionResults.args;
      whichMedia.fetchStatus = collectionResults.fetchStatus;
      content = (
        <SearchResultsTable
          title={formatMessage(localMessages.title, { name: whichMedia.storedKeyword.mediaKeyword })}
          whichMedia={whichMedia}
          handleToggleAndSelectMedia={handleToggleAndSelectMedia}
        />
      );
    } else {
      content = <FeaturedCollectionsContainer handleToggleAndSelectMedia={handleToggleAndSelectMedia} />;
    }
    return (
      <div>
        <MediaPickerSearchForm
          initValues={whichMedia}
          onSearch={val => this.updateMediaQuery(val)}
          hintText={formatMessage(localMessages.hintText)}
        />
        {content}
      </div>
    );
  }
}

CollectionSearchRresultsContainer.propTypes = {
  intl: PropTypes.object.isRequired,
  handleToggleAndSelectMedia: PropTypes.func.isRequired,
  updateMediaQuerySelection: PropTypes.func.isRequired,
  selectedMediaQueryKeyword: PropTypes.string,
  selectedMediaQueryType: PropTypes.number,
  featured: PropTypes.object,
  collectionResults: PropTypes.object,
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
      CollectionSearchRresultsContainer
    )
  );

