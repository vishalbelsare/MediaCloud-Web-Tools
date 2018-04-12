import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../common/AsyncContainer';
import { fetchCollectionSourceList } from '../../../actions/sourceActions';
import SourceList from '../../common/SourceList';

const CollectionSourceListContainer = props => (
  <SourceList
    collectionId={props.collectionId}
    sources={props.sources}
    downloadUrl={`/api/collections/${props.collectionId}/sources.csv`}
  />
);

CollectionSourceListContainer.propTypes = {
  // parent
  collectionId: PropTypes.number,
  downloadUrl: PropTypes.string,
  // from store
  sources: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.sources.collections.selected.collectionSourceList.fetchStatus,
  sources: state.sources.collections.selected.collectionSourceList.sources,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  asyncFetch: () => {
    dispatch(fetchCollectionSourceList(ownProps.collectionId));
  },
});

export default
  connect(mapStateToProps, mapDispatchToProps)(
    composeAsyncContainer(
      CollectionSourceListContainer
    )
  );
