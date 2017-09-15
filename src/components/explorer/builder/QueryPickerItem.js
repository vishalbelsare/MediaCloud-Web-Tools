import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import AppButton from '../../common/AppButton';
import QueryPickerLoggedInHeader from './QueryPickerLoggedInHeader';
import QueryPickerDemoHeader from './QueryPickerDemoHeader';
import { getShortDate } from '../../../lib/dateUtil';

const localMessages = {
  emptyMedia: { id: 'explorer.querypicker.emptyMedia',
    defaultMessage: 'no media sources or collections' },
  sourceStatus: { id: 'explorer.querypicker.sources', defaultMessage: '{srcCount, plural, \n =1 {# source} \n other {# sources }\n}' },
  collOneStatus: { id: 'explorer.querypicker.coll', defaultMessage: '{label}' },
  collStatus: { id: 'explorer.querypicker.coll', defaultMessage: '{collCount, plural, \n =1 {# collection} \n other {# collections }\n}' },
  searchHint: { id: 'explorer.querypicker.searchHint', defaultMessage: 'keywords' },
  queryDialog: { id: 'explorer.querypicker.queryDialog', defaultMessage: 'The query label shows up on the legend of the various charts and graphs below. We autogenerate it for you based on your query, but you can also set your own short name to make the charts easier to read.' },
};

const focusUsernameInputField = (input) => {
  if (input) {
    setTimeout(() => { input.focus(); }, 100);
  }
};
class QueryPickerItem extends React.Component {
  state = {
    labelChangeDialogOpen: false,
    tempLabel: '',
  };

  handleBlurAndSelection = () => {
    const { onQuerySelected } = this.props;
    onQuerySelected();
  };
  updateTempLabel = (val) => {
    this.setState({ tempLabel: val });
  };
  handleOpen = () => {
    const { query } = this.props;
    this.setState({ showIconMenu: false, labelChangeDialogOpen: true, tempLabel: query.label });
  };

  handleClose = () => {
    this.setState({ labelChangeDialogOpen: false });
  };
  handleChangeAndClose = () => {
    const { updateQueryProperty } = this.props;
    this.setState({ labelChangeDialogOpen: false });
    const updatedLabel = this.state.tempLabel;
    updateQueryProperty('label', updatedLabel);
  };

  handleColorClick = (color) => {
    this.setState({ showColor: color });
  };
  handleMenuItemKeyDown = (evt) => {
    const { handleSearch } = this.props;
    switch (evt.key) {
      case 'Enter':
        handleSearch();
        break;
      default: break;
    }
  };

  render() {
    const { user, query, isSelected, isDeletable, displayLabel, isLabelEditable, updateQueryProperty, updateDemoQueryLabel, handleDeleteQuery, handleSearch } = this.props;
    const { formatMessage } = this.props.intl;
    let subT = null;
    let headerInfo = null;
    /* query fields are only editable in place for Demo mode. the user can delete a query
      in Logged-In mode, the user can click the icon button, and edit the label of the query or delete the query
    */
    const actions = [
      <AppButton
        label="Cancel"
        primary
        onClick={this.handleClose}
      />,
      <AppButton
        label="Save"
        primary
        keyboardFocused
        onClick={() => this.handleChangeAndClose(query)}
      />,
    ];
    if (query) {
      if (user.isLoggedIn) {
        headerInfo = (
          <QueryPickerLoggedInHeader
            user={user} query={query}
            handleOpen={this.handleOpen}
            isDeletable={isDeletable}
            displayLabel={displayLabel} handleDeleteQuery={handleDeleteQuery}
            handleSearch={handleSearch} updateQueryProperty={updateQueryProperty}
            handleMenuItemKeyDown={this.handleMenuItemKeyDown}
          />
        );
      } else { // can delete only if this is a custom query (vs sample query) for demo users and this is not the only QueryPickerItem
        headerInfo = (
          <QueryPickerDemoHeader
            user={user} query={query}
            handleOpen={this.handleOpen}
            isDeletable={isDeletable} handleDeleteQuery={handleDeleteQuery}
            handleSearch={handleSearch} updateQueryProperty={updateQueryProperty}
            updateDemoQueryLabel={updateDemoQueryLabel}
            isLabelEditable={isLabelEditable} handleMenuItemKeyDown={this.handleMenuItemKeyDown} focusUsernameInputField={focusUsernameInputField}
          />
        );
      }

      const collCount = query.collections ? query.collections.length : 0;
      const srcCount = query.sources ? query.sources.length : 0;
      // const srcDesc = query.media;
      const totalCount = collCount + srcCount;
      const queryLabel = query.label;
      const oneCollLabelOrNumber = query.collections[0] && query.collections[0].label ? query.collections[0].label : '';
      const oneCollLabel = collCount === 1 ? oneCollLabelOrNumber : '';

      const oneCollStatus = <FormattedMessage {...localMessages.collOneStatus} values={{ label: oneCollLabel }} />;
      subT = <FormattedMessage {...localMessages.emptyMedia} values={{ totalCount }} />;

      if (srcCount === 0 && collCount === 1) {
        subT = (
          <div className="query-info">
            {displayLabel ? query.label : ''}
            {oneCollStatus}<br />
            {query.startDate ? getShortDate(query.startDate) : ''} to {query.endDate ? getShortDate(query.endDate) : ''}
          </div>
        );
      } else if (totalCount > 0) {
        subT = (
          <div className="query-info">
            {displayLabel ? query.label : ''}
            <FormattedMessage {...localMessages.collStatus} values={{ collCount, label: queryLabel }} /><br />
            <FormattedMessage {...localMessages.sourceStatus} values={{ srcCount, label: queryLabel }} /><br />
            {query.startDate ? getShortDate(query.startDate) : ''} to {query.endDate ? getShortDate(query.endDate) : ''}
          </div>
        );
      }
    }
    const extraClassNames = (isSelected) ? 'selected' : '';

    return (
      <div
        className={`query-picker-item ${extraClassNames}`}
        onTouchTap={() => this.handleBlurAndSelection()}
      >
        {headerInfo}
        <Dialog
          title="Change Query Label"
          actions={actions}
          modal={false}
          open={this.state.labelChangeDialogOpen}
          onRequestClose={this.handleClose}
        >
          <p><FormattedMessage {...localMessages.queryDialog} /></p>
          <TextField
            className="query-picker-editable-name"
            id="tempLabel"
            name="tempLabel"
            onChange={(e, val) => {
              this.updateTempLabel(val);
            }}
            ref={focusUsernameInputField}
            hintText={query.label || formatMessage(localMessages.searchHint)}
          />
        </Dialog>
        {subT}
      </div>
    );
  }
}

QueryPickerItem.propTypes = {
  // from parent
  query: React.PropTypes.object,
  isSelected: React.PropTypes.bool.isRequired,
  isLabelEditable: React.PropTypes.bool.isRequired,
  isDeletable: React.PropTypes.func.isRequired,
  displayLabel: React.PropTypes.bool.isRequired,
  onQuerySelected: React.PropTypes.func,
  updateQueryProperty: React.PropTypes.func.isRequired,
  updateDemoQueryLabel: React.PropTypes.func.isRequired,
  handleSearch: React.PropTypes.func.isRequired,
  handleDeleteQuery: React.PropTypes.func.isRequired,
  loadEditLabelDialog: React.PropTypes.func,
  // from composition
  intl: React.PropTypes.object.isRequired,
  user: React.PropTypes.object.isRequired,
};


export default
  injectIntl(
    QueryPickerItem
  );
