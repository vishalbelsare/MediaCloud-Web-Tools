import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import QueryPickerLoadUserSearchesDialog from './QueryPickerLoadUserSearchesDialog';
import QueryPickerSaveUserSearchesDialog from './QueryPickerSaveUserSearchesDialog';


const QueryPickerCustomQueryHandler = (props) => {
  const { handleLoadSearch, handleSaveSearch, savedSearches, searchNickname, submitting } = props;
  return (
    <div>
      <QueryPickerLoadUserSearchesDialog handleLoadSearch={handleLoadSearch} searches={savedSearches} submitting={submitting} />
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
  handleSaveSearch: PropTypes.func,
  handleLoadSearch: PropTypes.func,
  // from composition
  intl: PropTypes.object.isRequired,
};


export default
  injectIntl(
    QueryPickerCustomQueryHandler
  );
