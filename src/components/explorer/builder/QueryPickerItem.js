import React from 'react';
import { injectIntl } from 'react-intl';
import TextField from 'material-ui/TextField';

const QueryPickerItem = (props) => {
  const { query, isEditable } = props;
  let nameInfo = null;
  if (isEditable) {
    nameInfo = <TextField id="name" value={query.label} />;
  } else {
    nameInfo = <h2>{query.label}</h2>;
  }
  return (
    <div className="query-picker-item">
      {nameInfo}
      <p>Summary Info</p>
    </div>
  );
};

QueryPickerItem.propTypes = {
  // from parent
  query: React.PropTypes.object,
  isEditable: React.PropTypes.bool.isRequired,
  // from composition
  intl: React.PropTypes.object.isRequired,
};


export default
  injectIntl(
    QueryPickerItem
  );
