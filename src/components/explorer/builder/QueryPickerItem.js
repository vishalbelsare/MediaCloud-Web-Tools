import React from 'react';
import { injectIntl } from 'react-intl';
import TextField from 'material-ui/TextField';
import GridList from 'material-ui/GridList';

const QueryPickerItem = (props) => {
  const { query, isEditable, selectThisQuery } = props;
  let nameInfo = null;
  if (isEditable) {
    nameInfo = <TextField id="name" value={query.label} />;
  } else {
    nameInfo = <h2>{query.label}</h2>;
  }
  return (
    <GridList className="query-picker-item" onClick={() => selectThisQuery()}>
      <span className="query-picker-item-color" style={{ width: 10, height: 10, backgroundColor: `${query.label}`, display: 'block' }} />
      {nameInfo}
      <p>{query.description}</p>
      <p>{query.startDate}</p>
    </GridList>
  );
};

QueryPickerItem.propTypes = {
  // from parent
  query: React.PropTypes.object,
  isEditable: React.PropTypes.bool.isRequired,
  selectThisQuery: React.PropTypes.func,
  // from composition
  intl: React.PropTypes.object.isRequired,
};


export default
  injectIntl(
    QueryPickerItem
  );
