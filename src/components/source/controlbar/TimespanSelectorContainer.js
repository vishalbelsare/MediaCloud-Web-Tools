import React from 'react';
import { connect } from 'react-redux';

import ErrorTryAgain from '../../util/ErrorTryAgain';
import LoadingSpinner from '../../util/LoadingSpinner';
import TimespanSelector from '../../vis/controlbar/TimespanSelector';
import { fetchSourceSnapshotTimespansList, filterByTimespan } from '../../../actions/sourceActions';
import * as fetchConstants from '../../../lib/fetchConstants.js';

class TimespanSelectorContainer extends React.Component {
  componentDidMount() {
    const { fetchData, sourceId, snapshotId, timespanId } = this.props;
    if ((sourceId !== null) && (snapshotId !== null)) {
      fetchData(sourceId, snapshotId, timespanId);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (((nextProps.sourceId !== this.props.sourceId) ||
        (nextProps.snapshotId !== this.props.snapshotId)) &&
        (nextProps.sourceId !== null) && (nextProps.snapshotId !== null)) {
      const { fetchData } = this.props;
      fetchData(nextProps.sourceId, nextProps.snapshotId, nextProps.timespanId);
    }
  }
  getStyles() {
    const styles = {
      root: {
      },
    };
    return styles;
  }
  render() {
    const { timespans, fetchStatus, fetchData, onTimespanSelected } = this.props;
    let content = fetchStatus;
    const styles = this.getStyles();
    switch (fetchStatus) {
      case fetchConstants.FETCH_SUCCEEDED:
        content = <TimespanSelector timespans={timespans} onTimespanSelected={onTimespanSelected} />;
        break;
      case fetchConstants.FETCH_FAILED:
        content = <ErrorTryAgain onTryAgain={fetchData} />;
        break;
      default:
        content = <LoadingSpinner />;
    }
    return (
      <div style={styles.root}>
        {content}
      </div>
    );
  }
}

TimespanSelectorContainer.propTypes = {
  fetchStatus: React.PropTypes.string.isRequired,
  timespans: React.PropTypes.array.isRequired,
  fetchData: React.PropTypes.func.isRequired,
  onTimespanSelected: React.PropTypes.func.isRequired,
  sourceId: React.PropTypes.number,
  snapshotId: React.PropTypes.number,
  timespanId: React.PropTypes.number,
};

const mapStateToProps = (state) => ({
  sourceId: state.source.selected.id,
  fetchStatus: state.source.selected.timespans.fetchStatus,
  timespans: state.source.selected.timespans.list,
  snapshotId: state.source.selected.filters.snapshotId,
  timespanId: state.source.selected.filters.timespanId,
});

const mapDispatchToProps = (dispatch) => ({
  fetchData: (sourceId, snapshotId, timespanId) => {
    dispatch(fetchSourceSnapshotTimespansList(sourceId, snapshotId))
      .then((response) => {
        if (timespanId === null) {
          dispatch(filterByTimespan(response.results[0].controversy_dump_time_slices_id));
        }
      });
  },
  onTimespanSelected: (event) => {
    dispatch(filterByTimespan(event.target.value));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimespanSelectorContainer);
