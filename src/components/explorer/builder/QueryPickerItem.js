import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import TextField from 'material-ui/TextField';
import { Card } from 'material-ui/Card';
import ColorPicker from '../../common/ColorPicker';

const localMessages = {
  emptyMedia: { id: 'explorer.querypicker.emptyMedia',
    defaultMessage: 'no media sources or collections' },
  sourceStatus: { id: 'explorer.querypicker.sources', defaultMessage: '{srcCount, plural, \n =1 {# source} \n other {# sources }\n}' },
  collOneStatus: { id: 'explorer.querypicker.coll', defaultMessage: '{label}' },
  collStatus: { id: 'explorer.querypicker.coll', defaultMessage: '{collCount, plural, \n =1 {# collection} \n other {# collections }\n}' },
};

class QueryPickerItem extends React.Component {
  handleColorClick(color) {
    this.setState({ showColor: color });
  }

  render() {
    const { query, isEditable, selectThisQuery, updateQuery } = this.props;
    let nameInfo = null;
    let subT = null;

    if (query) {
      if (isEditable) {
        nameInfo = (
          <div>
            <ColorPicker
              color={query.color}
              onChange={(e, val) => updateQuery(e, val)}
            />
            <TextField
              id="q"
              name="q"
              value={query.q}
              hintText={query.q}
              onChange={(e, val) => updateQuery(e, val)}
            />
          </div>
        );
      } else {
        nameInfo = (
          <div>
            <ColorPicker
              color={query.color}
              onChange={(e, val) => updateQuery(e, val)}
            />
            {query.q}
          </div>
        );
      }

      const collCount = query.collections ? query.collections.length : 0;
      const srcCount = query.sources ? query.sources.length : 0;
      // const srcDesc = query.media;
      const totalCount = collCount + srcCount;
      const queryLabel = query.label;
      const oneCollLabel = collCount === 1 ? query.collections[0].label : '';

      const oneCollStatus = <FormattedMessage {...localMessages.collOneStatus} values={{ label: oneCollLabel }} />;
      subT = <FormattedMessage {...localMessages.emptyMedia} values={{ totalCount }} />;

      if (srcCount === 0 && collCount === 1) {
        // TODO start_date vs startDate
        subT = (
          <div className="query-picker-item-card-header">
            {query.label}<br />
            {oneCollStatus}<br />
            {query.startDate}--{query.endDate}
          </div>
        );
      } else if (totalCount > 0) {
        subT = (
          <div className="query-picker-item-card-header">
            {query.label}
            <FormattedMessage {...localMessages.collStatus} values={{ collCount, label: queryLabel }} /><br />
            <FormattedMessage {...localMessages.sourceStatus} values={{ srcCount, label: queryLabel }} /><br />
            {query.start_date}--{query.end_date}
          </div>
        );
      }
    }

    return (
      <Card className="query-picker-item" onClick={() => selectThisQuery()}>
        {nameInfo}
        {subT}
      </Card>
    );
  }
}

QueryPickerItem.propTypes = {
  // from parent
  query: React.PropTypes.object,
  isEditable: React.PropTypes.bool.isRequired,
  selectThisQuery: React.PropTypes.func,
  updateQuery: React.PropTypes.func.isRequired,
  // from composition
  intl: React.PropTypes.object.isRequired,
};


export default
  injectIntl(
    QueryPickerItem
  );
