import React from 'react';
import { connect } from 'react-redux';

import ErrorTryAgain from '../../util/ErrorTryAgain';
import LoadingSpinner from '../../util/LoadingSpinner';
import SnapshotSelector from '../../vis/controlbar/SnapshotSelector';
import { fetchSourceSnapshotsList, filterBySnapshot } from '../../../actions/sourceActions';
import * as fetchConstants from '../../../lib/fetchConstants.js';

class SnapshotSelectorContainer extends React.Component {
  componentDidMount() {
    const { fetchData, snapshotId, sourceId } = this.props;
    if (sourceId !== null) {
      fetchData(sourceId, snapshotId);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.sourceId !== this.props.sourceId) {
      const { fetchData } = this.props;
      fetchData(nextProps.sourceId, nextProps.snapshotId);
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
    const { snapshots, fetchStatus, fetchData, onSnapshotSelected, snapshotId } = this.props;
    let content = fetchStatus;
    const styles = this.getStyles();
    switch (fetchStatus) {
      case fetchConstants.FETCH_SUCCEEDED:
        content = <SnapshotSelector selectedId={snapshotId} snapshots={snapshots} onSnapshotSelected={onSnapshotSelected} />;
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

SnapshotSelectorContainer.propTypes = {
  fetchStatus: React.PropTypes.string.isRequired,
  snapshots: React.PropTypes.array.isRequired,
  fetchData: React.PropTypes.func.isRequired,
  onSnapshotSelected: React.PropTypes.func.isRequired,
  sourceId: React.PropTypes.number,
  snapshotId: React.PropTypes.number,
};

const mapStateToProps = (state) => ({
  sourceId: state.source.selected.id,
  fetchStatus: state.source.selected.snapshots.fetchStatus,
  snapshots: state.source.selected.snapshots.list,
  snapshotId: state.source.selected.filters.snapshotId,
});

const mapDispatchToProps = (dispatch) => ({
  fetchData: (sourceId, snapshotId) => {
    dispatch(fetchSourceSnapshotsList(sourceId))
      .then((response) => {
        if (snapshotId === null) {
          dispatch(filterBySnapshot(response.results[0].controversy_dumps_id));
        }
      });
  },
  onSnapshotSelected: (snapshotId) => {
    dispatch(filterBySnapshot(snapshotId));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SnapshotSelectorContainer);
