import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import Chip from 'material-ui/Chip';
import messages from '../../../resources/messages';
import { trimToMaxLength } from '../../../lib/stringUtil';

const MAX_QUERY_LENGTH = 30;

/**
 */
const ActiveFilters = (props) => {
  const { focus, query, onRemoveFocus, onRemoveQuery } = props;
  let focusChip;
  let queryChip;
  if (focus) {
    focusChip = (
      <Chip
        backgroundColor="rgb(255,255,255)"
        style={{ border: '1px solid rgb(189,189,189)', display: 'inline-flex' }}
        onRequestDelete={onRemoveFocus}
      >
        <FormattedMessage {...messages.focus} />: {focus.name}
      </Chip>
    );
  }
  if (query) {
    queryChip = (
      <Chip
        backgroundColor="rgb(255,255,255)"
        style={{ border: '1px solid rgb(189,189,189)', display: 'inline-flex' }}
        onRequestDelete={onRemoveQuery}
      >
        <FormattedMessage {...messages.query} />: {trimToMaxLength(query, MAX_QUERY_LENGTH)}
      </Chip>
    );
  }
  return (
    <div className="active-filters">
      {queryChip} {focusChip}
    </div>
  );
};

ActiveFilters.propTypes = {
  // from parent
  focus: PropTypes.object,
  onRemoveFocus: PropTypes.func.isRequired,
  query: PropTypes.string,
  onRemoveQuery: PropTypes.func.isRequired,
};

export default injectIntl(ActiveFilters);
