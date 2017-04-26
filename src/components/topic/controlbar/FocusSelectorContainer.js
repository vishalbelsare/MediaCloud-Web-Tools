import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import FocusSelector from './FocusSelector';

const FocusSelectorContainer = (props) => {
  const { foci, selectedFocus, onFocusSelected } = props;
  return (
    <FocusSelector
      selectedId={(selectedFocus) ? selectedFocus.foci_id : null}
      foci={foci}
      onFocusSelected={onFocusSelected}
      location={location}
    />
  );
};

FocusSelectorContainer.propTypes = {
  // from parent
  topicId: React.PropTypes.number.isRequired,
  location: React.PropTypes.object.isRequired,
  snapshotId: React.PropTypes.number,
  onFocusSelected: React.PropTypes.func.isRequired,
  // from composition
  intl: React.PropTypes.object.isRequired,
  // from state
  foci: React.PropTypes.array.isRequired,
  selectedFocus: React.PropTypes.object,
};

const mapStateToProps = state => ({
  foci: state.topics.selected.focalSets.foci.list,
  selectedFocus: state.topics.selected.focalSets.foci.selected,
});

export default
  connect(mapStateToProps)(
    injectIntl(
      FocusSelectorContainer
    )
  );
