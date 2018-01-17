import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import List from 'material-ui/List';
import AppButton from '../../common/AppButton';

const localMessages = {
  loadSearchTitle: { id: 'explorer.querypicker.loadSearchTitle', defaultMessage: 'Load One of Your Saved Searches' },
  loadSavedSearches: { id: 'explorer.querypicker.loadSavedSearches', defaultMessage: 'Load Saved Search...' },
  delete: { id: 'explorer.querypicker.delete', defaultMessage: 'Delete' },
  load: { id: 'explorer.querypicker.load', defaultMessage: 'Load' },
};

class QueryPickerLoadUserSearchesDialog extends React.Component {
  state = {
    loadSearchDialogOpen: false,
    selectedSearch: '',  // the actual label they type into the change-label popup dialog
  };
  onSaveRequest = () => {
    this.setState({ loadSearchDialogOpen: true });
  }
  onLoadRequest = () => {
    this.setState({ loadSearchDialogOpen: true });
  }

  onLoadConfirm = () => {
    const { handleLoadSearch } = this.props;
    handleLoadSearch({ selectedSearch: this.state.selectedSearch });
  };

  handleDialogClose = () => {
    this.setState({ loadSearchDialogOpen: false });
  };

  handleLabelChangeAndClose = () => {
    this.setState({ loadSearchDialogOpen: false });
    this.onSaveConfirm();
  };

  updateTextInDialog = (val) => {
    this.setState({ searchName: val });
  };
  render() {
    const { searches, onDelete, onLoad, submitting } = this.props;
    const { formatMessage } = this.props.intl;
    const actions = [
      <FlatButton
        label="Delete"
        secondary
        onClick={onDelete}
      />,
      <FlatButton
        label="Load"
        primary
        keyboardFocused
        onClick={onLoad}
      />,
    ];
    if (searches !== null) {
      return (
        <div className="search-handler">
          <Dialog
            title={formatMessage(localMessages.loadSearchTitle)}
            modal={false}
            actions={actions}
            open={this.state.loadSearchDialogOpen}
            onRequestClose={this.handleDialogClose}
          >
            <List
              className="query-picker-save-search-list"
              id="searchNameInDialog"
              name="searchNameInDialog"
              onChange={(e, val) => {
                this.updateTextInDialog(val);
              }}
            />
          </Dialog>
          <AppButton
            style={{ marginTop: 30 }}
            onClick={this.onLoadRequest}
            label={formatMessage(localMessages.loadSavedSearches)}
            disabled={submitting}
            secondary
          />
        </div>
      );
    }
    return null;
  }
}

QueryPickerLoadUserSearchesDialog.propTypes = {
  // from parent
  submitting: PropTypes.bool.isRequired,
  searches: PropTypes.array.isRequired,
  onDelete: PropTypes.func,
  handleLoadSearch: PropTypes.func,
  onLoad: PropTypes.func,
  // from composition
  intl: PropTypes.object.isRequired,
};


export default
  injectIntl(
    QueryPickerLoadUserSearchesDialog
  );
