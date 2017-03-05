import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { fetchTopicFocalSetsList } from '../../../actions/topicActions';
import { NO_SPINNER, asyncContainerize } from '../../common/AsyncContainer';
import FocusSelector from './FocusSelector';

class FocusSelectorContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.snapshotId !== this.props.snapshotId) {
      const { fetchData } = this.props;
      fetchData(nextProps.topicId, nextProps.snapshotId);
    }
  }
  render() {
    const { foci, selectedFocus, onFocusSelected } = this.props;
    return (
      <FocusSelector
        selectedId={(selectedFocus) ? selectedFocus.foci_id : null}
        foci={foci}
        onFocusSelected={onFocusSelected}
        location={location}
      />
    );
  }
}

FocusSelectorContainer.propTypes = {
  // from parent
  topicId: React.PropTypes.number.isRequired,
  location: React.PropTypes.object.isRequired,
  snapshotId: React.PropTypes.number,
  onFocusSelected: React.PropTypes.func.isRequired,
  // from composition
  intl: React.PropTypes.object.isRequired,
  // from dispatch
  fetchData: React.PropTypes.func.isRequired,
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

const mapDispatchToProps = dispatch => ({
  fetchData: (topicId, snapshotId) => {
    if (topicId !== null) {
      dispatch(fetchTopicFocalSetsList(topicId, snapshotId));
    }
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
    asyncContainerize(
      injectIntl(
        FocusSelectorContainer
      ), NO_SPINNER
    )
  );
