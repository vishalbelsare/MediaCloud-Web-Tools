import PropTypes from 'prop-types';
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

export const NO_FOCAL_SET_SELECTED = 0;

const FocusSetSelectorContainer = (props) => {
  const { selectedFocalSetId, topicId, focalSets, onFocalSetSelected, hideNoneOption } = props;
  const { formatMessage } = props.intl;
  const linkToNewFoci = `/topics/${topicId}/snapshot/foci`;
  let noneOption = null;
  if (hideNoneOption !== true) {
    noneOption = (<MenuItem value={NO_FOCAL_SET_SELECTED} primaryText={formatMessage(localMessages.noFocalSet)} />);
  }
  let content = null;
  if (focalSets.length > 0) {
    content = (
      <div>
        <p>
          <FormattedMessage {...localMessages.pick} />
        </p>
        <SelectField
          value={selectedFocalSetId !== NO_FOCAL_SET_SELECTED ? selectedFocalSetId : focalSets[0].focal_sets_id}
          onChange={onFocalSetSelected}
          fullWidth
        >
          {focalSets.map(fs =>
            <MenuItem key={fs.focal_sets_id} value={fs.focal_sets_id} primaryText={fs.name} />)
          }
          {noneOption}
        </SelectField>
      </div>
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
      {content}
    </div>
  );
};

FocusSetSelectorContainer.propTypes = {
  // from parents
  topicId: PropTypes.number.isRequired,
  snapshotId: PropTypes.number,
  onFocalSetSelected: PropTypes.func.isRequired,
  selectedFocalSetId: PropTypes.number,
  // from composition
  intl: PropTypes.object.isRequired,
  // from dispatch
  // from mergeProps
  // from state
  focalSets: PropTypes.array.isRequired,
  hideNoneOption: PropTypes.bool,
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
