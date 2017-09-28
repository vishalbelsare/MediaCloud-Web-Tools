import React from 'react';
import { injectIntl } from 'react-intl';
import TextField from 'material-ui/TextField';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import ColorPicker from '../../common/ColorPicker';
import QueryHelpDialog from '../../common/help/QueryHelpDialog';

const localMessages = {
  searchHint: { id: 'explorer.querypicker.searchHint', defaultMessage: 'keywords' },
};

class QueryPickerDemoHeader extends React.Component {
  render() {
    const { query, isLabelEditable, isDeletable, onColorChange, onDelete, handleMenuItemKeyDown, focusUsernameInputField } = this.props;
    const { formatMessage } = this.props.intl;
    let nameInfo = <div />;
    const isThisAProtectedQuery = query.searchId !== null && query.searchId !== undefined;
    /*
      in Logged-In mode, the user can click the icon button, and edit the label of the query or delete the query
    */
    let iconOptions = null;
    let menuChildren = null;
    if (query) {
      if (!isThisAProtectedQuery && isDeletable()) { // can delete only if this is a custom query (vs sample query) for demo users and this is not the only QueryPickerItem
        menuChildren = (
          <MenuItem primaryText="Delete" onTouchTap={() => onDelete(query)} />
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
      const colorPickerContent = (
        <ColorPicker
          color={query.color}
          onChange={e => onColorChange(e.value)}
        />
      );
      if (isLabelEditable) { // determine whether the label is editable or not (demo or logged in)
        nameInfo = (
          <div>
            <div>
              {colorPickerContent}
              <TextField
                className="query-picker-editable-name"
                id={`query-${query.index}-q`}
                name="q"
                defaultValue={query.q}
                hintText={formatMessage(localMessages.searchHint)}
                onKeyPress={handleMenuItemKeyDown}
                ref={focusUsernameInputField}
              />
              {iconOptions}
            </div>
            <div className="query-help-info">
              <QueryHelpDialog />
            </div>
          </div>
        );
      } else {  // the labels are not editable when the Demo user views the sample searches
        nameInfo = (
          <div>
            {colorPickerContent}
            &nbsp;
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
  query: React.PropTypes.object.isRequired,
  isLabelEditable: React.PropTypes.bool.isRequired,
  isDeletable: React.PropTypes.func.isRequired,
  onColorChange: React.PropTypes.func.isRequired,
  updateDemoQueryLabel: React.PropTypes.func.isRequired,
  onDelete: React.PropTypes.func.isRequired,
  handleMenuItemKeyDown: React.PropTypes.func.isRequired,
  focusUsernameInputField: React.PropTypes.func.isRequired,
  // from composition
  intl: React.PropTypes.object.isRequired,
};


export default
  injectIntl(
    QueryPickerDemoHeader
  );
