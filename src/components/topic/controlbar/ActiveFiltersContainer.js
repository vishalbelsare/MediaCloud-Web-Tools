import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import ActiveFilters from './ActiveFilters';

/**
 */
const ActiveFiltersContainer = (props) => {
  const { selectedFocus, onRemoveFocus } = props;
  return (
    <ActiveFilters focus={selectedFocus} onRemoveFocus={onRemoveFocus} />
  );
};

ActiveFiltersContainer.propTypes = {
  // from parent
  onRemoveFocus: PropTypes.func.isRequired,
  // from state
  selectedFocus: PropTypes.object,
};

const mapStateToProps = state => ({
  selectedFocus: state.topics.selected.focalSets.foci.selected,
});

export default
  injectIntl(
    connect(mapStateToProps)(
      ActiveFiltersContainer
    )
  );
