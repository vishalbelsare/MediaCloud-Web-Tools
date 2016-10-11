import React from 'react';
import { push } from 'react-router-redux';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { fetchTopicFocalSetsList, filterByFocus } from '../../../actions/topicActions';
import { NO_SPINNER, composeAsyncContainer } from '../../common/AsyncContainer';
import { filteredLocation } from '../../util/location';
import FocusSelector from './FocusSelector';

const REMOVE_FOCUS = 0;

class FocusSelectorContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.snapshotId !== this.props.snapshotId) {
      const { fetchData } = this.props;
      fetchData(nextProps.topicId, nextProps.snapshotId);
    }
  }
  render() {
    const { foci, selectedFocus, handleFocusSelected } = this.props;
    return (
      <FocusSelector
        selectedId={(selectedFocus) ? selectedFocus.foci_id : null}
        foci={foci}
        onFocusSelected={handleFocusSelected}
      />
    );
  }
}

FocusSelectorContainer.propTypes = {
  // from parent
  topicId: React.PropTypes.number.isRequired,
  location: React.PropTypes.object.isRequired,
  snapshotId: React.PropTypes.number,
  // from composition
  intl: React.PropTypes.object.isRequired,
  // from dispatch
  fetchData: React.PropTypes.func.isRequired,
  handleFocusSelected: React.PropTypes.func.isRequired,
  // from mergeProps
  asyncFetch: React.PropTypes.func.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  foci: React.PropTypes.array.isRequired,
  selectedFocus: React.PropTypes.object,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.focalSets.foci.fetchStatus,
  foci: state.topics.selected.focalSets.foci.list,
  selectedFocus: state.topics.selected.focalSets.foci.selected,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (topicId, snapshotId) => {
    if (topicId !== null) {
      dispatch(fetchTopicFocalSetsList(topicId, snapshotId));
    }
  },
  handleFocusSelected: (focusId) => {
    const selectedFocusId = (focusId === REMOVE_FOCUS) ? null : focusId;
    const newLocation = filteredLocation(ownProps.location, { focusId: selectedFocusId });
    dispatch(push(newLocation));
    dispatch(filterByFocus(selectedFocusId));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(ownProps.topicId, ownProps.snapshotId);
    },
  });
}

export default
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(
    composeAsyncContainer(
      injectIntl(
        FocusSelectorContainer
      ), NO_SPINNER
    )
  );
