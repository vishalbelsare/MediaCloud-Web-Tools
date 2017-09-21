import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import QueryPicker from './QueryPicker';

const QueryBuilderContainer = (props) => {
  const { isEditable, onSearch } = props;
  return (
    <div className="query-builder">
      <QueryPicker isEditable={isEditable} onSearch={onSearch} />
    </div>
  );
};

QueryBuilderContainer.propTypes = {
  intl: React.PropTypes.object.isRequired,
  onSearch: React.PropTypes.func.isRequired,
  isEditable: React.PropTypes.bool.isRequired,
  queries: React.PropTypes.array,
};


export default
  injectIntl(
    connect()(
      QueryBuilderContainer
    )
  );
