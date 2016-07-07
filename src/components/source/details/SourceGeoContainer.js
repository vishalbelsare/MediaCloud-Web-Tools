import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import LoadingSpinner from '../../util/LoadingSpinner';
import { Link } from 'react-router';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';

import GeoChart from '../../vis/GeoChart.js';
import { fetchSourceGeo } from '../../../actions/sourceActions';
import * as fetchConstants from '../../../lib/fetchConstants.js';

class SourceGeoContainer extends React.Component {
  componentDidMount() {
    const { fetchStatus, fetchData, sourceId } = this.props;
    if (fetchStatus !== fetchConstants.FETCH_FAILED) {
      fetchData(sourceId);
    }
  }

  render() {
    const { fetchStatus, sourceId } = this.props;
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
  fetchStatus: state.sources.selected.details.sourceDetailsReducer.geoTag.fetchStatus,
  total: state.sources.selected.details.sourceDetailsReducer.geoTag.total,
  geolist: state.sources.selected.details.sourceDetailsReducer.geoTag.list,
  sourceId: state.sources.selected.details.sourceDetailsReducer.sourceDetails.object.id,
});

const mapDispatchToProps = (dispatch) => ({
  fetchData: (sourceId) => {
    dispatch(fetchSourceGeo(sourceId));
  },
});

SourceGeoContainer.propTypes = {
  geolist: React.PropTypes.array.isRequired,
  sourceId: React.PropTypes.string.isRequired,
  intl: React.PropTypes.object.isRequired,
  fetchData: React.PropTypes.func.isRequired,
};

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(SourceGeoContainer));
