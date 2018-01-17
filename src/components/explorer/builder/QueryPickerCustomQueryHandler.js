import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import QueryPickerLoadUserSearchesDialog from './QueryPickerLoadUserSearchesDialog';
import QueryPickerSaveUserSearchesDialog from './QueryPickerSaveUserSearchesDialog';


const QueryPickerCustomQueryHandler = (props) => {
  const { handleLoadSearch, handleLoadSelectedSearch, handleSaveSearch, savedSearches, searchNickname, submitting } = props;
  return (
    <div>
      <QueryPickerLoadUserSearchesDialog handleLoadSearch={handleLoadSearch} handleLoadSelectedSearch={handleLoadSelectedSearch} searches={savedSearches} submitting={submitting} />
      <QueryPickerSaveUserSearchesDialog handleSaveSearch={handleSaveSearch} searchNickname={searchNickname} submitting={submitting} />
    </div>

  );
};


QueryPickerCustomQueryHandler.propTypes = {
  // from parent
  submitting: PropTypes.bool,
  updateQuery: PropTypes.func,
  handleSubmit: PropTypes.func,
  pristine: PropTypes.bool,

  searchNickname: PropTypes.string.isRequired,
  savedSearches: PropTypes.array,
  handleSaveSearch: PropTypes.func.isRequired,
  handleLoadSearch: PropTypes.func.isRequired,
  handleLoadSelectedSearch: PropTypes.func.isRequired,
  // from composition
  intl: PropTypes.object.isRequired,
};


export default
  injectIntl(
    QueryPickerCustomQueryHandler
  );
