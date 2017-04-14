import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { connect } from 'react-redux';
import Link from 'react-router/lib/Link';

const localMessages = {
  pick: { id: 'attention.focalSet.selector.intro', defaultMessage: 'Pick a Set to compare the attention between the Subtopics.' },
  noFocalSet: { id: 'attention.focalSet.selector.none', defaultMessage: '(None)' },
  linktoCreateFocalSet: { id: 'attention.focalSet.selector.none', defaultMessage: "You don't have any subtopics defined. Click this link to build some in order to compare them here." },
};

const REMOVE_FOCUS_SET = 0;

const FocusSetSelectorContainer = (props) => {
  const { selectedFocalSetId, topicId, focalSets, onFocalSetSelected } = props;
  const { formatMessage } = props.intl;
  const linkToNewFoci = `/topics/${topicId}/snapshot/foci`;
  let content = null;
  if (focalSets.length > 0) {
    content = (
      <SelectField value={selectedFocalSetId !== '0' ? selectedFocalSetId : focalSets[0].focal_sets_id} onChange={onFocalSetSelected}>
        {focalSets.map(fs =>
          <MenuItem key={fs.focal_sets_id} value={fs.focal_sets_id} primaryText={fs.name} />)
        }
        <MenuItem value={REMOVE_FOCUS_SET} primaryText={formatMessage(localMessages.noFocalSet)} />
      </SelectField>
    );
  } else {
    content = (
      <Link to={linkToNewFoci}>
        <FormattedMessage {...localMessages.linktoCreateFocalSet} />
      </Link>
    );
  }
  return (
    <div className="focalset-selector">
      <p>
        <FormattedMessage {...localMessages.pick} />
      </p>
      {content}
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
  // from mergeProps
  // from state
  focalSets: React.PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.focalSets.all.fetchStatus,
  focalSets: state.topics.selected.focalSets.all.list,
});

export default
  connect(mapStateToProps)(
    injectIntl(
      FocusSetSelectorContainer
    )
  );
