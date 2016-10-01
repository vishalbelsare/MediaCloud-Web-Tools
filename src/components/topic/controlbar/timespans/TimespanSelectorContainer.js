import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { fetchTopicTimespansList, filterByTimespan, toggleTimespanControls, setTimespanVisiblePeriod }
  from '../../../../actions/topicActions';
import composeAsyncContainer from '../../../common/AsyncContainer';
import { filteredLocation } from '../../../util/location';
import TimespanSelector from './TimespanSelector';

class TimespanSelectorContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { filters, fetchData, selectedTimespan } = this.props;
    if (((nextProps.filters.snapshotId !== filters.snapshotId) ||
         (nextProps.filters.focusId !== filters.focusId)) &&
        (nextProps.topicId !== null) && (nextProps.filters.snapshotId !== null)) {
      fetchData(nextProps.topicId, nextProps.filters.snapshotId, nextProps.filters.focusId, nextProps.timespanId, selectedTimespan);
    }
  }
  refetchData = () => {
    const { topicId, filters, timespanId, fetchData, selectedTimespan } = this.props;
    fetchData(topicId, filters.snapshotId, filters.focusId, timespanId, selectedTimespan);
  }
  render() {
    const { timespans, selectedTimespan, setExpanded, handleTimespanSelected, handlePeriodSelected, isVisible, selectedPeriod } = this.props;
    let content = null;
    if ((timespans.length > 0) && (selectedTimespan !== null) && (selectedTimespan !== undefined)) {
      content = (
        <TimespanSelector
          timespans={timespans}
          isExpanded={isVisible}
          selectedPeriod={selectedPeriod}
          selectedTimespan={selectedTimespan}
          onTimespanSelected={handleTimespanSelected}
          onPeriodSelected={handlePeriodSelected}
          setExpanded={setExpanded}
        />
      );
    }
    return (
      <div className="timespan-selector-wrapper">
        {content}
      </div>
    );
  }
}

TimespanSelectorContainer.propTypes = {
  // from parent
  topicId: React.PropTypes.number.isRequired,
  location: React.PropTypes.object.isRequired,
  filters: React.PropTypes.object.isRequired,
  // from dispatch
  fetchData: React.PropTypes.func.isRequired,
  handleTimespanSelected: React.PropTypes.func.isRequired,
  setExpanded: React.PropTypes.func.isRequired,
  handlePeriodSelected: React.PropTypes.func.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  timespans: React.PropTypes.array.isRequired,
  isVisible: React.PropTypes.bool.isRequired,
  selectedPeriod: React.PropTypes.string.isRequired,
  timespanId: React.PropTypes.number,
  selectedTimespan: React.PropTypes.object,
};

// helper to update the url and fire off event
function updateTimespan(dispatch, location, snapshotId, focusId, timespanId) {
  const newLocation = filteredLocation(location, { snapshotId, focusId, timespanId });
  dispatch(filterByTimespan(timespanId));
  dispatch(push(newLocation));
}

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.timespans.fetchStatus,
  timespans: state.topics.selected.timespans.list,
  timespanId: state.topics.selected.filters.timespanId,
  isVisible: state.topics.selected.timespans.isVisible,
  selectedPeriod: state.topics.selected.timespans.selectedPeriod,
  selectedTimespan: state.topics.selected.timespans.selected,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handlePeriodSelected: (period) => {
    dispatch(setTimespanVisiblePeriod(period));
  },
  setExpanded: (isExpanded) => {
    dispatch(toggleTimespanControls(isExpanded));
  },
  fetchData: (topicId, snapshotId, focusId, timespanId, selectedTimespan) => {
    const cleanedFocus = isNaN(focusId) ? null : focusId;
    dispatch(fetchTopicTimespansList(topicId, snapshotId, { focusId: cleanedFocus }))
      .then((response) => {
        let pickDefault = false;
        if (timespanId === null || isNaN(timespanId)) {
          // no timespan selected so we'll default to one
          pickDefault = true;
        } else if ((selectedTimespan !== undefined) && (selectedTimespan !== null) && (selectedTimespan.foci_id !== cleanedFocus)) {
          // if the topic has switched, we need to figure out what the corresponding timespan is
          // iterate through new list of timespans to find one with a matching period, start_date and end_date
          const matchingNewTimespan = response.list.find(ts => (
            ((ts.period === selectedTimespan.period) && (ts.start_date === selectedTimespan.start_date) && (ts.end_date === selectedTimespan.end_date))
          ));
          if (matchingNewTimespan !== undefined) {
            updateTimespan(dispatch, ownProps.location, matchingNewTimespan.snapshots_id, matchingNewTimespan.foci_id, matchingNewTimespan.timespans_id);
          } else {
            pickDefault = true;
          }
        }
        if (pickDefault) {
          const defaultTimespanId = response.list[0].timespans_id;
          const newSnapshotId = response.list[0].snapshots_id;
          updateTimespan(dispatch, ownProps.location, newSnapshotId, response.list[0].foci_id, defaultTimespanId);
        }
      });
  },
  handleTimespanSelected: (timespan) => {
    updateTimespan(dispatch, ownProps.location, timespan.snapshots_id, timespan.foci_id, timespan.timespans_id);
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      if (ownProps.filters.snapshotId !== null) {
        dispatchProps.fetchData(ownProps.topicId, ownProps.filters.snapshotId,
          ownProps.filters.focusId, stateProps.timespanId, stateProps.selectedTimespan);
      }
    },
  });
}

export default
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(
    composeAsyncContainer(
      TimespanSelectorContainer
    )
  );
