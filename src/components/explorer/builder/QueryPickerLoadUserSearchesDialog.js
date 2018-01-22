import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedHTMLMessage } from 'react-intl';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import { List, ListItem } from 'material-ui/List';
import Link from 'react-router/lib/Link';
import { DeleteButton } from '../../common/IconButton';
import AppButton from '../../common/AppButton';

const localMessages = {
  loadSearchTitle: { id: 'explorer.querypicker.loadSearchTitle', defaultMessage: 'Load One of Your Saved Searches' },
  loadSavedSearches: { id: 'explorer.querypicker.loadSavedSearches', defaultMessage: 'Load Saved Search...' },
  delete: { id: 'explorer.querypicker.deleteSearch', defaultMessage: 'Delete' },
  load: { id: 'explorer.querypicker.loadSearch', defaultMessage: 'Load' },
  noSavedSearches: { id: 'explorer.querypicker.noSearches', defaultMessage: '<p>You have no saved searches.  You can save any searches you find useful and use this screen to reload it later.</p>' },
};

class QueryPickerLoadUserSearchesDialog extends React.Component {
  state = {
    loadSearchDialogOpen: false,
    selectedSearch: '',  // the actual label they type into the change-label popup dialog
  };

  onLoadRequest = () => {
    const { handleLoadSearches } = this.props;
    this.setState({ loadSearchDialogOpen: true });
    handleLoadSearches();
  }

  onDeleteRequest = (selectedSearch) => {
    const { handleDeleteSearch } = this.props;
    handleDeleteSearch(selectedSearch);
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
    let searchList;
    if (searches !== null && searches.length > 0) {
      searchList = (
        <List
          className="query-picker-save-search-list"
          id="searchNameInDialog"
          name="searchNameInDialog"
        >
          {searches.map((search, idx) => (
            <ListItem key={idx}>
              <Link key={idx} to={`queries/search?q=${search.queryParams}`}>{search.queryName}</Link>
              <DeleteButton onClick={() => this.onDeleteRequest(search)} />
            </ListItem>
          ))}
        </List>
      );
    } else {
      // no searches so show a nice messages
      searchList = (
        <FormattedHTMLMessage {...localMessages.noSavedSearches} />
      );
    }
    return (
      <div className="load-saved-search-wrapper">
        <Dialog
          title={formatMessage(localMessages.loadSearchTitle)}
          modal={false}
          actions={actions}
          open={this.state.loadSearchDialogOpen}
          onRequestClose={this.handleDialogClose}
        >
          {searchList}
        </Dialog>
        <AppButton
          style={{ marginTop: 30 }}
          onClick={this.onLoadRequest}
          label={formatMessage(localMessages.loadSavedSearches)}
          disabled={submitting}
        />
      </div>
    );
  }
}

QueryPickerLoadUserSearchesDialog.propTypes = {
  // from parent
  submitting: PropTypes.bool.isRequired,
  searches: PropTypes.array.isRequired,
  onDelete: PropTypes.func,
  handleLoadSearches: PropTypes.func.isRequired,
  handleLoadSelectedSearch: PropTypes.func.isRequired,
  handleDeleteSearch: PropTypes.func.isRequired,
  onLoad: PropTypes.func,
  // from composition
  intl: PropTypes.object.isRequired,
};


export default
  injectIntl(
    QueryPickerLoadUserSearchesDialog
  );
