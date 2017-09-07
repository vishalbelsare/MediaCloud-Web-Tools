import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import QueryPicker from './QueryPicker';

const QueryBuilderContainer = (props) => {
  const { queries, isEditable, handleSearch } = props;
  return (
    <div className="query-builder">
      <QueryPicker isEditable={isEditable} handleSearch={() => handleSearch(queries)} />
    </div>
  );
};

QueryBuilderContainer.propTypes = {
  intl: React.PropTypes.object.isRequired,
  handleSearch: React.PropTypes.func.isRequired,
  isEditable: React.PropTypes.bool.isRequired,
  queries: React.PropTypes.array,
};


export default
  injectIntl(
    connect()(
      QueryBuilderContainer
    )
  );
