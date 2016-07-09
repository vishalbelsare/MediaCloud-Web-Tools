import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import LoadingSpinner from '../../util/LoadingSpinner';
import Paper from 'material-ui/Paper';

import GeoChart from '../../vis/GeoChart.js';
import { fetchSourceGeo } from '../../../actions/sourceActions';
import * as fetchConstants from '../../../lib/fetchConstants.js';

const localMessages = {
  title: { id: 'source.summary.geoChart.title', defaultMessage: 'Geographic Attention' },
};

class SourceGeoContainer extends React.Component {
  componentDidMount() {
    const { fetchStatus, fetchData, sourceId } = this.props;
    if (fetchStatus !== fetchConstants.FETCH_FAILED) {
      fetchData(sourceId);
    }
  }
  getStyles() {
    const styles = {
      contentWrapper: {
        padding: 10,
      },
    };
    return styles;
  }
  render() {
    const { sectionDescription, fetchStatus } = this.props;
    let content = <div />;
    const styles = this.getStyles();
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
      <div style={styles.root}>
        <Paper>
          <div style={styles.contentWrapper}>
            <h2><FormattedMessage {...localMessages.title} /></h2>
            {sectionDescription}
            {content}
          </div>
        </Paper>
      </div>
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
  fetchStatus: React.PropTypes.string,
  sectionDescription: React.PropTypes.object,
};

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(SourceGeoContainer));
