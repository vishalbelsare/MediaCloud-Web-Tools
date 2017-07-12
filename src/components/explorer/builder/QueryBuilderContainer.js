import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid } from 'react-flexbox-grid/lib';
import QueryPicker from './QueryPicker';

const QueryBuilderContainer = (props) => {
  const { queries, isEditable, setSelectedQuery, handleSearch } = props;
  return (
    <Grid className="query-picker">
      <QueryPicker isEditable={isEditable} onClick={setSelectedQuery} handleSearch={() => handleSearch(queries)} />
    </Grid>
  );
};

QueryBuilderContainer.propTypes = {
  intl: React.PropTypes.object.isRequired,
  handleSearch: React.PropTypes.func.isRequired,
  isEditable: React.PropTypes.bool.isRequired,
  setSelectedQuery: React.PropTypes.func.isRequired,
  queries: React.PropTypes.array,
};


export default
  injectIntl(
    connect()(
      QueryBuilderContainer
    )
  );
