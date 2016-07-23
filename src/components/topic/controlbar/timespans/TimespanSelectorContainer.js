import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import TimespanSelector from './TimespanSelector';
import TimespanCollapsed from './TimespanCollapsed';
import { fetchTopicTimespansList, filterByTimespan, toggleTimespanControls } from '../../../../actions/topicActions';
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
    const { timespans, onTimespanSelected, timespanId, isVisible, visibleTab } = this.props;
    let content = null;
    if (isVisible) {
      content = (<TimespanSelector
        selectedId={timespanId}
        timespans={timespans}
        onTimespanSelected={onTimespanSelected}
        onCollapse={this.handleCollapse}
      />);
    } else {
      let timespan = null;
      for (const idx in timespans) {
        if (timespans[idx].timespans_id === timespanId) {
          timespan = timespans[idx];
        }
      }
      content = <TimespanCollapsed timespan={timespan} onExpand={this.handleExpand} />;
    }
    return content;
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
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  timespans: React.PropTypes.array.isRequired,
  isVisible: React.PropTypes.bool.isRequired,
  selectedTab: React.PropTypes.string.isRequired,
  snapshotId: React.PropTypes.number,
  timespanId: React.PropTypes.number,
};

const mapStateToProps = (state) => ({
  fetchStatus: state.topics.selected.timespans.fetchStatus,
  timespans: state.topics.selected.timespans.list,
  snapshotId: state.topics.selected.filters.snapshotId,
  timespanId: state.topics.selected.filters.timespanId,
  isVisible: state.topics.selected.timespans.isVisible,
  selectedTab: state.topics.selected.timespans.selectedTab,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
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
