import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import ErrorTryAgain from '../../util/ErrorTryAgain';
import LoadingSpinner from '../../util/LoadingSpinner';
import TimespanSelector from './TimespanSelector';
import { fetchTopicSnapshotTimespansList, filterByTimespan } from '../../../actions/topicActions';
import * as fetchConstants from '../../../lib/fetchConstants.js';

class TimespanSelectorContainer extends React.Component {
  componentDidMount() {
    const { topicId, snapshotId } = this.props;
    if ((topicId !== null) && (snapshotId !== null)) {
      this.refetchData();
    }
  }
  componentWillReceiveProps(nextProps) {
    if (((nextProps.topicId !== this.props.topicId) ||
        (nextProps.snapshotId !== this.props.snapshotId)) &&
        (nextProps.topicId !== null) && (nextProps.snapshotId !== null)) {
      const { fetchData } = this.props;
      fetchData(nextProps.topicId, nextProps.snapshotId, nextProps.timespanId);
    }
  }
  getStyles() {
    const styles = {
      root: {
        paddingTop: 18,
      },
    };
    return styles;
  }
  refetchData = () => {
    const { topicId, snapshotId, timespanId, fetchData } = this.props;
    fetchData(topicId, snapshotId, timespanId);
  }
  render() {
    const { timespans, fetchStatus, onTimespanSelected, timespanId } = this.props;
    let content = fetchStatus;
    const styles = this.getStyles();
    switch (fetchStatus) {
      case fetchConstants.FETCH_SUCCEEDED:
        content = <TimespanSelector selectedId={timespanId} timespans={timespans} onTimespanSelected={onTimespanSelected} />;
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

TimespanSelectorContainer.propTypes = {
  // from parent
  topicId: React.PropTypes.number,
  location: React.PropTypes.object.isRequired,
  // from dispatch
  fetchData: React.PropTypes.func.isRequired,
  onTimespanSelected: React.PropTypes.func.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  timespans: React.PropTypes.array.isRequired,
  snapshotId: React.PropTypes.number,
  timespanId: React.PropTypes.number,
};

const mapStateToProps = (state) => ({
  fetchStatus: state.topics.selected.timespans.fetchStatus,
  timespans: state.topics.selected.timespans.list,
  snapshotId: state.topics.selected.filters.snapshotId,
  timespanId: state.topics.selected.filters.timespanId,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (topicId, snapshotId, timespanId) => {
    dispatch(fetchTopicSnapshotTimespansList(topicId, snapshotId))
      .then((response) => {
        if (timespanId === null || isNaN(timespanId)) {
          const defaultTimespanId = response.list[0].controversy_dump_time_slices_id;
          const newLocation = Object.assign({}, ownProps.location, {
            query: {
              ...ownProps.location.query,
              timespanId: defaultTimespanId,
            },
          });
          dispatch(push(newLocation));
          dispatch(filterByTimespan(defaultTimespanId));
        }
      });
  },
  onTimespanSelected: (event) => {
    const timespanId = event.target.value;
    const newLocation = Object.assign({}, ownProps.location, {
      query: {
        ...ownProps.location.query,
        timespanId,
      },
    });
    dispatch(push(newLocation));
    dispatch(filterByTimespan(timespanId));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimespanSelectorContainer);
