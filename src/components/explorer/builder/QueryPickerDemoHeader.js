import React from 'react';
import { injectIntl } from 'react-intl';
import TextField from 'material-ui/TextField';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import ColorPicker from '../../common/ColorPicker';

const localMessages = {
  searchHint: { id: 'explorer.querypicker.searchHint', defaultMessage: 'keywords' },
};

class QueryPickerDemoHeader extends React.Component {
  render() {
    const { user, query, isLabelEditable, isDeletable, updateQueryProperty, updateDemoQueryLabel, handleDeleteQuery, handleMenuItemKeyDown, focusUsernameInputField } = this.props;
    const { formatMessage } = this.props.intl;
    let nameInfo = <div />;
    const isThisAProtectedQuery = !user.isLoggedIn && query.searchId !== null && query.searchId !== undefined;
    /*
      in Logged-In mode, the user can click the icon button, and edit the label of the query or delete the query
    */
    let iconOptions = null;
    let menuChildren = null;
    if (query) {
      if (!user.isLoggedIn && !isThisAProtectedQuery && isDeletable()) { // can delete only if this is a custom query (vs sample query) for demo users and this is not the only QueryPickerItem
        menuChildren = (
          <MenuItem primaryText="Delete" onTouchTap={() => handleDeleteQuery(query)} />
        );
      }
      if (menuChildren !== null) {
        iconOptions = (
          <IconMenu
            className="query-picker-icon-button"
            iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
            anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
            targetOrigin={{ horizontal: 'left', vertical: 'top' }}
          >
            {menuChildren}
          </IconMenu>
        );
      }
      if (isLabelEditable) { // determine whether the label is editable or not (demo or logged in)
        nameInfo = (
          <div>
            <ColorPicker
              color={query.color}
              onChange={e => updateQueryProperty(e.name, e.value)}
            />
            <TextField
              className="query-picker-editable-name"
              id="q"
              name="q"
              value={query.q}
              hintText={query.q || formatMessage(localMessages.searchHint)}
              onChange={(e, val) => {
                updateDemoQueryLabel(val); // both are connected
              }}
              onKeyPress={handleMenuItemKeyDown}
              ref={focusUsernameInputField}
            />
            {iconOptions}
          </div>
        );
      } else {  // the labels are not editable when the Demo user views the sample searches
        nameInfo = (
          <div>
            <ColorPicker
              color={query.color}
              onChange={e => updateQueryProperty(e.name, e.value)}
            />&nbsp;
            <span
              className="query-picker-name"
            >
              {query.label}
            </span>
            {iconOptions}
          </div>
        );
      }
    }
    return nameInfo;
  }
}
QueryPickerDemoHeader.propTypes = {
  // from parent
  query: React.PropTypes.object,
  isSelected: React.PropTypes.bool.isRequired,
  isLabelEditable: React.PropTypes.bool.isRequired,
  isDeletable: React.PropTypes.func.isRequired,
  onQuerySelected: React.PropTypes.func,
  updateQueryProperty: React.PropTypes.func.isRequired,
  updateDemoQueryLabel: React.PropTypes.func.isRequired,
  handleSearch: React.PropTypes.func.isRequired,
  handleDeleteQuery: React.PropTypes.func.isRequired,
  handleMenuItemKeyDown: React.PropTypes.func.isRequired,
  focusUsernameInputField: React.PropTypes.func.isRequired,
  loadEditLabelDialog: React.PropTypes.func,
  // from composition
  intl: React.PropTypes.object.isRequired,
  user: React.PropTypes.object,
};


export default
  injectIntl(
    QueryPickerDemoHeader
  );
