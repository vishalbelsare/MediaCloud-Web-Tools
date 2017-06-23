import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import TextField from 'material-ui/TextField';
import { Card, CardHeader } from 'material-ui/Card';

const localMessages = {
  emptyMedia: { id: 'explorer.querypicker.emptyMedia',
    defaultMessage: 'no media sources or collections' },
  sourceStatus: { id: 'explorer.querypicker.sources', defaultMessage: '{srcCount, plural, \n =1 {# source} \n other {# sources }\n}' },
  collOneStatus: { id: 'explorer.querypicker.coll', defaultMessage: '{label}' },
  collStatus: { id: 'explorer.querypicker.coll', defaultMessage: '{collCount, plural, \n =1 {# collection} \n other {# collections }\n}' },
};

const QueryPickerItem = (props) => {
  const { query, isEditable, selectThisQuery, updateQuery } = props;
  let nameInfo = null;
  let subT = null;

  if (query) {
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

    const collCount = query.collections.length;
    const srcCount = query.sources.length;
    // const srcDesc = query.media;
    const totalCount = collCount + srcCount;
    const queryLabel = query.label;

    const oneCollStatus = <FormattedMessage {...localMessages.collOneStatus} values={{ label: queryLabel }} />;
    subT = <FormattedMessage {...localMessages.emptyMedia} values={{ totalCount }} />;

    if (srcCount === 0 && collCount === 1) {
      // only show collStatus
      subT = oneCollStatus;
    } else if (totalCount > 0) {
      subT = (
        <div className="query-picker-item-card-header">
          <FormattedMessage {...localMessages.collStatus} values={{ collCount, label: queryLabel }} /><br />
          <FormattedMessage {...localMessages.sourceStatus} values={{ srcCount, label: queryLabel }} /><br />
          {query.start_date}--{query.end_date}
        </div>
      );
    }
  }

  return (
    <Card className="query-picker-item" onClick={() => selectThisQuery()}>
      <CardHeader
        title={nameInfo}
        subtitle={subT}
      />
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
