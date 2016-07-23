import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import TimespanExpanded from './TimespanExpanded';
import TimespanCollapsed from './TimespanCollapsed';
import { fetchTopicTimespansList, filterByTimespan, toggleTimespanControls, setTimespanVisiblePeriod }
  from '../../../../actions/topicActions';
import composeAsyncWidget from '../../../util/composeAsyncWidget';

class TimespanSelectorContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (((nextProps.topicId !== this.props.topicId) ||
        (nextProps.snapshotId !== this.props.snapshotId)) &&
        (nextProps.topicId !== null) && (nextProps.snapshotId !== null)) {
      const { fetchData } = this.props;
      fetchData(nextProps.topicId, nextProps.snapshotId, nextProps.timespanId);
    }
  }
  refetchData = () => {
    const { topicId, snapshotId, timespanId, fetchData } = this.props;
    fetchData(topicId, snapshotId, timespanId);
  }
  handleExpand = (evt) => {
    const { setExpanded } = this.props;
    evt.preventDefault();
    setExpanded(true);
  }
  handleCollapse = (evt) => {
    const { setExpanded } = this.props;
    evt.preventDefault();
    setExpanded(false);
  }
  render() {
    const { timespans, onTimespanSelected, onPeriodSelected, timespanId, isVisible, selectedPeriod } = this.props;
    let content = null;
    let selectedTimespan = null;
    for (const idx in timespans) {
      if (timespans[idx].timespans_id === timespanId) {
        selectedTimespan = timespans[idx];
      }
    }
    if (isVisible) {
      content = (<TimespanExpanded
        timespans={timespans}
        selectedTimespan={selectedTimespan}
        onTimespanSelected={onTimespanSelected}
        selectedPeriod={selectedPeriod}
        onPeriodSelected={onPeriodSelected}
        onCollapse={this.handleCollapse}
      />);
    } else {
      content = <TimespanCollapsed timespan={selectedTimespan} onExpand={this.handleExpand} />;
    }
    return (
      <div className="timespan-selector">
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
  setExpanded: React.PropTypes.func.isRequired,
  onPeriodSelected: React.PropTypes.func.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  timespans: React.PropTypes.array.isRequired,
  isVisible: React.PropTypes.bool.isRequired,
  selectedPeriod: React.PropTypes.string.isRequired,
  snapshotId: React.PropTypes.number,
  timespanId: React.PropTypes.number,
};

const mapStateToProps = (state) => ({
  fetchStatus: state.topics.selected.timespans.fetchStatus,
  timespans: state.topics.selected.timespans.list,
  snapshotId: state.topics.selected.filters.snapshotId,
  timespanId: state.topics.selected.filters.timespanId,
  isVisible: state.topics.selected.timespans.isVisible,
  selectedPeriod: state.topics.selected.timespans.selectedPeriod,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onPeriodSelected: (period) => {
    dispatch(setTimespanVisiblePeriod(period));
  },
  setExpanded: (isExpanded) => {
    dispatch(toggleTimespanControls(isExpanded));
  },
  fetchData: (topicId, snapshotId, timespanId) => {
    dispatch(fetchTopicTimespansList(topicId, snapshotId))
      .then((response) => {
        if (timespanId === null || isNaN(timespanId)) {
          const defaultTimespanId = response.list[0].timespans_id;
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

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(ownProps.topicId, stateProps.snapshotId, stateProps.timespanId);
    },
  });
}

export default
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(
    composeAsyncWidget(
      TimespanSelectorContainer
    )
  );
