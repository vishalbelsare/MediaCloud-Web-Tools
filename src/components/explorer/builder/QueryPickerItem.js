import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import TextField from 'material-ui/TextField';
import { Card, CardHeader, CardText } from 'material-ui/Card';

const localMessages = {
  sandCStatus: { id: 'explorer.querypicker.sourcesCollections',
    defaultMessage: '{totalCount, plural,\n =0 {no media sources} \n =1 {Sources:} srcCount \n other {Sources:} srcCount \n}.' },
};

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
          value={query.q}
          hintText={query.q}
          onChange={updateQuery}
        />
      </div>
    );
  } else {
    nameInfo = <div><span style={{ width: 10, height: 10, backgroundColor: `${query.color}`, display: 'inline-block' }} />{query.q}</div>;
  }
  const collCount = query['collections[]'].length;
  const srcCount = query['sources[]'].length;
  const totalCount = collCount + srcCount;
  const subT = <FormattedMessage {...localMessages.sandCStatus} values={{ totalCount, srcCount, collCount }} />;


  return (
    <Card className="query-picker-item" onClick={() => selectThisQuery()}>
      <CardHeader
        title={nameInfo}
        subtitle={subT}
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
