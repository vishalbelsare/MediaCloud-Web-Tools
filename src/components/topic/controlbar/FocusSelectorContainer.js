import React from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { fetchTopicFocalSetsList, filterByFocus } from '../../../actions/topicActions';
import composeAsyncContainer from '../../common/AsyncContainer';
import { filteredLocation } from '../../util/paging';
import LinkWithFilters from '../LinkWithFilters';
import messages from '../../../resources/messages';

const REMOVE_FOCUS = 0;

class FocusSelectorContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.snapshotId !== this.props.snapshotId) {
      const { fetchData } = this.props;
      fetchData(nextProps.topicId, nextProps.snapshotId);
    }
  }
  handleChange = (event, index, value) => {
    const { handleFocusSelected } = this.props;
    handleFocusSelected(value);
  }
  render() {
    const { foci, topicId, selectedFocus } = this.props;
    const { formatMessage } = this.props.intl;
    let content = null;
    const selectedId = (selectedFocus !== null) ? selectedFocus.foci_id : null;
    if (foci.length !== 0) {
      content = (
        <SelectField value={selectedId}
          onChange={this.handleChange}
          hintText={formatMessage(messages.focusPick)}
        >
          {foci.map(f =>
            <MenuItem key={f.foci_id} value={f.foci_id} primaryText={`${f.focalSet.name}: ${f.name}`} />
          )}
          <MenuItem key={REMOVE_FOCUS} value={REMOVE_FOCUS} primaryText={formatMessage(messages.removeFocus)} />
        </SelectField>
      );
    } else {
      content = (
        <LinkWithFilters to={`/topics/${topicId}/foci/create`}>
          <FormattedMessage {...messages.focusCreate} />
        </LinkWithFilters>
      );
    }
    return content;
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

const mapStateToProps = (state) => ({
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
    const newLocation = filteredLocation(ownProps.location, { selectedFocusId });
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
      )
    )
  );
