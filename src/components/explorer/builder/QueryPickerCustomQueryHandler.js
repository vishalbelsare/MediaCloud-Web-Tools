import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import { Col } from 'react-flexbox-grid/lib';
import AppButton from '../../common/AppButton';
import { generateQueryParamString } from '../../../lib/explorerUtil';

const localMessages = {
  saveSearchDialog: { id: 'explorer.querypicker.saveSearchDialog', defaultMessage: 'Save Search' },
  loadSavedSearches: { id: 'explorer.querypicker.loadSavedSearches', defaultMessage: 'Save Search' },
  searchHint: { id: 'explorer.querypicker.searchHint', defaultMessage: 'keywords' },
  saveSearch: { id: 'explorer.querypicker.saveSearch', defaultMessage: 'Save Search' },
};

class QueryPickerCustomQueryHandler extends React.Component {
  state = {
    saveSearchDialogOpen: false,
    searchName: '',  // the actual label they type into the change-label popup dialog
  };

  onSaveRequest = () => {
    this.setState({ saveSearchDialogOpen: true });
    // filter out removed ids...
  }

  onSaveConfirm = () => {
    const { queries, handleSaveSearch } = this.props;
    const searchstr = generateQueryParamString(queries.map(q => ({
      label: q.label,
      q: q.q,
      color: q.color,
      startDate: q.startDate,
      endDate: q.endDate,
      sources: q.sources, // de-aggregate media bucket into sources and collections
      collections: q.collections,
    })));
    const userSearch = {
      label: 'cindyquery',
      timestamp: Date.now(),
      params: searchstr,
    };
    handleSaveSearch(userSearch);
  };

  handleDialogClose = () => {
    this.setState({ labelChangeDialogOpen: false });
  };

  handleLabelChangeAndClose = () => {
    this.setState({ labelChangeDialogOpen: false });
  };

  updateTextInDialog = (val) => {
    this.setState({ searchName: val });
  };

  render() {
    const { handleLoadSearch, submitting } = this.props;
    const { formatMessage } = this.props.intl;

    return (
      <Col lg={12}>
        <Dialog
          title="Save Query"
          modal={false}
          open={this.state.saveSearchDialogOpen}
          onRequestClose={this.handleDialogClose}
        >
          <p><FormattedMessage {...localMessages.saveSearchDialog} /></p>
          <TextField
            className="query-picker-save-search-name"
            id="searchNameInDialog"
            name="searchNameInDialog"
            onChange={(e, val) => {
              this.updateTextInDialog(val);
            }}
            hintText={formatMessage(localMessages.searchHint)}
          />
        </Dialog>
        <AppButton
          style={{ marginTop: 30 }}
          onClick={handleLoadSearch}
          label={formatMessage(localMessages.loadSavedSearches)}
          disabled={submitting}
          secondary
        />
        <AppButton
          style={{ marginTop: 30 }}
          onClick={this.onSaveRequest}
          label={formatMessage(localMessages.saveSearch)}
          disabled={submitting}
          secondary
        />
      </Col>

    );
  }
}

QueryPickerCustomQueryHandler.propTypes = {
  // from parent
  updateQuery: PropTypes.func,
  handleSubmit: PropTypes.func,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool.isRequired,

  queries: PropTypes.array,
  onDelete: PropTypes.func,
  onLabelEditRequest: PropTypes.func,
  handleSaveSearch: PropTypes.func,
  handleLoadSearch: PropTypes.func,
  // from composition
  intl: PropTypes.object.isRequired,
};


export default
  injectIntl(
    QueryPickerCustomQueryHandler
  );
