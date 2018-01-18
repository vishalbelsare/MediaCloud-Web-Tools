import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import { List, ListItem } from 'material-ui/List';
import Link from 'react-router/lib/Link';
import { DeleteButton } from '../../common/IconButton';
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
    const { handleLoadSearch } = this.props;
    this.setState({ loadSearchDialogOpen: true });
    handleLoadSearch();
  }

  onLoadConfirm = () => {
    const { handleLoadSelectedSearch } = this.props;
    handleLoadSelectedSearch(this.state.selectedSearch);
    this.setState({ loadSearchDialogOpen: false });
  };

  handleDialogClose = () => {
    this.setState({ loadSearchDialogOpen: false });
  };

  handleLabelChangeAndClose = () => {
    this.setState({ loadSearchDialogOpen: false });
    this.onSaveConfirm();
  };

  updateSelectedSearch = (val) => {
    this.setState({ selectedSearch: val });
  };
  render() {
    const { searches, submitting } = this.props;
    const { formatMessage } = this.props.intl;
    const actions = [
      <FlatButton
        label="Cancel"
        primary
        keyboardFocused
        onClick={this.handleDialogClose}
      />,
    ];
    let children = (
      <AppButton
        style={{ marginTop: 30 }}
        onClick={this.onLoadRequest}
        label={formatMessage(localMessages.loadSavedSearches)}
        disabled={submitting}
        secondary
      />
    );
    if (searches !== null && searches.length > 0) {
      children = (
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
            >
              {searches.map((search, idx) => (
                <ListItem>
                  <Link key={idx} to={`queries/search?q=${search.queryParams}`}>{search.queryName}</Link>
                  <DeleteButton />
                </ListItem>
              ))}
            </List>
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
    return children;
  }
}

QueryPickerLoadUserSearchesDialog.propTypes = {
  // from parent
  submitting: PropTypes.bool.isRequired,
  searches: PropTypes.array.isRequired,
  onDelete: PropTypes.func,
  handleLoadSearch: PropTypes.func,
  handleLoadSelectedSearch: PropTypes.func,
  onLoad: PropTypes.func,
  // from composition
  intl: PropTypes.object.isRequired,
};


export default
  injectIntl(
    QueryPickerLoadUserSearchesDialog
  );
