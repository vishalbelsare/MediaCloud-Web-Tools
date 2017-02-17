import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { connect } from 'react-redux';
import { fetchTopicFocalSetsList } from '../../../actions/topicActions';
import { asyncContainerize } from '../../common/AsyncContainer';

const localMessages = {
  pick: { id: 'attention.focalSet.selector.intro', defaultMessage: 'Pick a Set to compare the attention between the Subtopics.' },
  noFocalSet: { id: 'attention.focalSet.selector.none', defaultMessage: '(None)' },
};

const REMOVE_FOCUS_SET = 0;

const FocusSetSelectorContainer = (props) => {
  const { selectedFocalSetId, focalSets, onFocalSetSelected } = props;
  const { formatMessage } = props.intl;
  return (
    <div className="focalset-selector">
      <p>
        <FormattedMessage {...localMessages.pick} />
      </p>
      <SelectField value={selectedFocalSetId} onChange={onFocalSetSelected}>
        {focalSets.map(fs => <MenuItem key={fs.focal_sets_id} value={fs.focal_sets_id} primaryText={fs.name} />)}
        <MenuItem value={REMOVE_FOCUS_SET} primaryText={formatMessage(localMessages.noFocalSet)} />
      </SelectField>
    </div>
  );
};

FocusSetSelectorContainer.propTypes = {
  // from parents
  topicId: React.PropTypes.number.isRequired,
  snapshotId: React.PropTypes.number,
  onFocalSetSelected: React.PropTypes.func.isRequired,
  selectedFocalSetId: React.PropTypes.string,
  // from composition
  intl: React.PropTypes.object.isRequired,
  // from dispatch
  fetchData: React.PropTypes.func.isRequired,
  // from mergeProps
  asyncFetch: React.PropTypes.func.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  focalSets: React.PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.focalSets.all.fetchStatus,
  focalSets: state.topics.selected.focalSets.all.list,
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
        FocusSetSelectorContainer
      )
    )
  );
