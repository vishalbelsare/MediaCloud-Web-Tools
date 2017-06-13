import React from 'react';
import { injectIntl } from 'react-intl';
import TextField from 'material-ui/TextField';
import { Card, CardHeader, CardText } from 'material-ui/Card';

const QueryPickerItem = (props) => {
  const { query, isEditable, selectThisQuery, updateQuery } = props;
  let nameInfo = null;
  if (isEditable) {
    nameInfo = (
      <div>
        <span style={{ width: 10, height: 10, backgroundColor: `${query.label}`, display: 'inline-block' }} />
        <TextField
          id="q"
          name="q"
          hintText={query.label}
          onChange={updateQuery}
        />
      </div>
    );
  } else {
    nameInfo = <div><span style={{ width: 10, height: 10, backgroundColor: `${query.color}`, display: 'inline-block' }} />{query.label}</div>;
  }
  return (
    <Card className="query-picker-item" onClick={() => selectThisQuery()}>
      <CardHeader
        title={nameInfo}
        subtitle={query.description}
      />
      <CardText>
        {query.start_date}
      </CardText>
    </Card>
  );
};

QueryPickerItem.propTypes = {
  // from parent
  query: React.PropTypes.object,
  isEditable: React.PropTypes.bool.isRequired,
  selectThisQuery: React.PropTypes.func,
  updateQuery: React.PropTypes.func,
  // from composition
  intl: React.PropTypes.object.isRequired,
};


export default
  injectIntl(
    QueryPickerItem
  );
