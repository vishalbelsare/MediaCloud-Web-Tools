import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import LoadingSpinner from '../../util/LoadingSpinner';
import Link from 'react-router/lib/Link';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';

import GeoChart from '../../vis/GeoChart.js';
import { fetchSourceCollectionGeo } from '../../../actions/sourceActions';
import * as fetchConstants from '../../../lib/fetchConstants.js';

class SourceCollectionGeoContainer extends React.Component {
  componentDidMount() {
    const { fetchStatus, fetchData, collectionId } = this.props;
    if (fetchStatus !== fetchConstants.FETCH_FAILED) {
      fetchData(collectionId);
    }
  }

  render() {
    const { fetchStatus, collectionId } = this.props;
    let content = <div />;
    switch (fetchStatus) {
      case fetchConstants.FETCH_SUCCEEDED:
        const { geolist } = this.props;
        content = (
          <GeoChart data={geolist} />
        );
        break;
      case fetchConstants.FETCH_FAILED:
        // content = <ErrorTryAgain onTryAgain={fetchData(sourceId)} />;
        break;
      default:
        content = <LoadingSpinner />;
    }
    return (
      <div>{ content }</div>
    );
  }
}

const mapStateToProps = (state) => ({
  fetchStatus: state.sources.selected.details.collectionDetailsReducer.collectionGeoTag.fetchStatus,
  total: state.sources.selected.details.collectionDetailsReducer.collectionGeoTag.total,
  geolist: state.sources.selected.details.collectionDetailsReducer.collectionGeoTag.list,
  collectionId: state.sources.selected.details.collectionDetailsReducer.collectionDetails.object.id,
});

const mapDispatchToProps = (dispatch) => ({
  fetchData: (sourceId) => {
    dispatch(fetchSourceCollectionGeo(sourceId));
  },
});

SourceCollectionGeoContainer.propTypes = {
  geolist: React.PropTypes.array.isRequired,
  collectionId: React.PropTypes.string.isRequired,
  intl: React.PropTypes.object.isRequired,
  fetchData: React.PropTypes.func.isRequired,
};

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(SourceCollectionGeoContainer));
