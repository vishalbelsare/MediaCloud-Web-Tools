import React from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import ErrorTryAgain from '../../common/ErrorTryAgain';
import LoadingSpinner from '../../util/LoadingSpinner';
import SnapshotSelector from './SnapshotSelector';
import { fetchTopicSnapshotsList, filterBySnapshot } from '../../../actions/topicActions';
import * as fetchConstants from '../../../lib/fetchConstants.js';

class SnapshotSelectorContainer extends React.Component {
  componentDidMount() {
    this.refetchData();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.topicId !== this.props.topicId) {
      const { fetchData } = this.props;
      fetchData(nextProps.topicId, nextProps.snapshotId);
    }
  }
  getStyles() {
    const styles = {
      root: {
        backgroundColor: '#303030',
        color: '#ffffff',
      },
      right: {
        float: 'right',
      },
    };
    return styles;
  }
  refetchData = () => {
    const { fetchData, snapshotId, topicId } = this.props;
    fetchData(topicId, snapshotId);
  }
  render() {
    const { snapshots, fetchStatus, onSnapshotSelected, snapshotId } = this.props;
    let content = fetchStatus;
    const styles = this.getStyles();
    switch (fetchStatus) {
      case fetchConstants.FETCH_SUCCEEDED:
        content = (
          <div style={styles.right}>
            <SnapshotSelector selectedId={snapshotId}
              snapshots={snapshots} onSnapshotSelected={onSnapshotSelected}
            />
          </div>
        );
        break;
      case fetchConstants.FETCH_FAILED:
        content = <ErrorTryAgain onTryAgain={this.refetchData} />;
        break;
      default:
        content = <LoadingSpinner padding={0} size={10} />;
    }
    return (
      <div style={styles.root}>
        {content}
      </div>
    );
  }
}

SnapshotSelectorContainer.propTypes = {
  // from parent
  topicId: React.PropTypes.number.isRequired,
  location: React.PropTypes.object.isRequired,
  // from dispatch
  fetchData: React.PropTypes.func.isRequired,
  onSnapshotSelected: React.PropTypes.func.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  snapshots: React.PropTypes.array.isRequired,
  snapshotId: React.PropTypes.number,
};

const mapStateToProps = (state) => ({
  fetchStatus: state.topics.selected.snapshots.fetchStatus,
  snapshots: state.topics.selected.snapshots.list,
  snapshotId: state.topics.selected.filters.snapshotId,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (topicId, snapshotId) => {
    if (topicId !== null) {
      dispatch(fetchTopicSnapshotsList(topicId))
        .then((response) => {
          if (snapshotId === null) {
            const newSnapshotId = response.list[0].controversy_dumps_id;
            const newLocation = Object.assign({}, ownProps.location, {
              query: {
                ...ownProps.location.query,
                timespanId: null,
                snapshotId: newSnapshotId,
              },
            });
            dispatch(push(newLocation));
            dispatch(filterBySnapshot(newSnapshotId));
          }
        });
    }
  },
  onSnapshotSelected: (snapshotId) => {
    const newLocation = Object.assign({}, ownProps.location, {
      query: {
        ...ownProps.location.query,
        timespanId: null,
        snapshotId,
      },
    });
    dispatch(push(newLocation));
    dispatch(filterBySnapshot(snapshotId));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SnapshotSelectorContainer);
