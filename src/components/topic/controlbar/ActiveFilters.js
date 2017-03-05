import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import Chip from 'material-ui/Chip';
import messages from '../../../resources/messages';

/**
 */
const ActiveFilters = (props) => {
  const { focus, onRemoveFocus } = props;
  let focusChip = null;
  if (focus) {
    focusChip = (
      <Chip
        backgroundColor={'rgb(255,255,255)'}
        style={{ border: '1px solid rgb(158,158,158)' }}
        onRequestDelete={onRemoveFocus}
      >
        <FormattedMessage {...messages.focus} />: {focus.name}
      </Chip>
    );
  }
  return (
    <div className="active-filters">
      {focusChip}
    </div>
  );
};

ActiveFilters.propTypes = {
  // from parent
  focus: React.PropTypes.object,
  onRemoveFocus: React.PropTypes.func.isRequired,
};

export default injectIntl(ActiveFilters);
