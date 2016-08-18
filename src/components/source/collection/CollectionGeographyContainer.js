import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../common/AsyncContainer';
import GeoChart from '../../vis/GeoChart.js';
import DataCard from '../../common/DataCard';
import { fetchSourceCollectionGeo } from '../../../actions/sourceActions';

const localMessages = {
  title: { id: 'source.summary.geoChart.title', defaultMessage: 'Geographic Attention' },
};

const CollectionGeographyContainer = (props) => {
  const { intro, geolist } = props;
  return (
    <DataCard>
      <h2><FormattedMessage {...localMessages.title} /></h2>
      <p>{intro}</p>
      <GeoChart data={geolist} />
    </DataCard>
  );
};

CollectionGeographyContainer.propTypes = {
  // from state
  geolist: React.PropTypes.array.isRequired,
  collectionId: React.PropTypes.string.isRequired,
  asyncFetch: React.PropTypes.func.isRequired,
  fetchStatus: React.PropTypes.string,
  // from parent
  intro: React.PropTypes.string,
  // from composition
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  fetchStatus: state.sources.selected.details.collectionDetailsReducer.collectionGeoTag.fetchStatus,
  total: state.sources.selected.details.collectionDetailsReducer.collectionGeoTag.total,
  geolist: state.sources.selected.details.collectionDetailsReducer.collectionGeoTag.list,
  collectionId: state.sources.selected.details.collectionDetailsReducer.collectionDetails.object.id,
});

const mapDispatchToProps = (dispatch) => ({
  fetchData: (collectionId) => {
    dispatch(fetchSourceCollectionGeo(collectionId));
  },
});


function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(stateProps.collectionId);
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      composeAsyncContainer(
        CollectionGeographyContainer
      )
    )
  );
