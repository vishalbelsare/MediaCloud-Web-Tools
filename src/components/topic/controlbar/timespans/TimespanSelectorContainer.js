import React from 'react';
import { connect } from 'react-redux';
import { replace, push } from 'react-router-redux';
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
function updateTimespan(dispatch, location, timespan, shouldPush) {
  const newLocation = filteredLocation(location,
    { snapshotId: timespan.snapshots_id, focusId: timespan.foci_id, timespanId: timespan.timespans_id });
  // console.log('updateTimestamp');
  // console.log(newLocation);
  dispatch(filterByTimespan(timespan.timespans_id));
  if (shouldPush) {
    // add to history
    dispatch(push(newLocation));
  } else {
    // do a replace, not a push here so the non-snapshot url isn't in the history
    dispatch(replace(newLocation));
  }
}

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.timespans.fetchStatus,
  timespans: state.topics.selected.timespans.list,
  timespanId: state.topics.selected.filters.timespanId,
  isVisible: state.topics.selected.timespans.isVisible,
  selectedPeriod: state.topics.selected.timespans.selectedPeriod,
  selectedTimespan: state.topics.selected.timespans.selected,
});

// when you switch snapshots we need to find the matching timespan in the new snapshot
function findMatchingTimespan(timespan, timespanList) {
  return timespanList.list.find(ts => (
    ((ts.period === timespan.period) && (ts.start_date === timespan.start_date) && (ts.end_date === timespan.end_date))
  ));
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  handlePeriodSelected: (period, firstTimespanInPeriod) => {
    dispatch(setTimespanVisiblePeriod(period));
    updateTimespan(dispatch, ownProps.location, firstTimespanInPeriod, true);
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
        } else if ((selectedTimespan !== null) && (selectedTimespan.foci_id !== cleanedFocus)) {
          // if the snapshot has switched, we need to figure out what the corresponding timespan is
          const matchingNewTimespan = findMatchingTimespan(selectedTimespan, response.list);
          if (matchingNewTimespan !== undefined) {
            updateTimespan(dispatch, ownProps.location, matchingNewTimespan, false);
          } else {
            pickDefault = true;
          }
        } else {
          // first load - match sure selected timespan period matches the selected timespan
          const matchingTimespan = response.list.find(ts => ts.timespans_id === timespanId);
          dispatch(setTimespanVisiblePeriod(matchingTimespan.period));
        }
        if (pickDefault) {
          const defaultTimespan = response.list[0]; // pick the first timespan as the default (this is the overall one)
          // console.log('pick default');
          // console.log(defaultTimespan);
          updateTimespan(dispatch, ownProps.location, defaultTimespan, false);
        }
      });
  },
  handleTimespanSelected: (timespan) => {
    updateTimespan(dispatch, ownProps.location, timespan, true);
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
