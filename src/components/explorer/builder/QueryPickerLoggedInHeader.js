import React from 'react';
import { injectIntl } from 'react-intl';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import ColorPicker from '../../common/ColorPicker';


class QueryPickerLoggedInHeader extends React.Component {
  render() {
    const { user, query, isDeletable, updateQueryProperty, handleDeleteQuery, handleOpen } = this.props;
    // const { formatMessage } = this.props.intl;
    let nameInfo = <div />;
    let menuChildren = null;
    let iconOptions = null;
    if (user && user.isLoggedIn) {
      if (isDeletable()) { // if logged in and this is not the only QueryPickerItem
        menuChildren = (
          <div>
            <MenuItem primaryText="Edit Query Label" onTouchTap={() => handleOpen()} />
            <MenuItem primaryText="Delete" onTouchTap={() => handleDeleteQuery(query)} />
          </div>
        );
      } else {
        menuChildren = (
          <div>
            <MenuItem primaryText="Edit Query Label" onTouchTap={() => handleOpen()} />
          </div>
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

      if (query) {
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

QueryPickerLoggedInHeader.propTypes = {
  // from parent
  query: React.PropTypes.object,
  isDeletable: React.PropTypes.func.isRequired,
  displayLabel: React.PropTypes.bool.isRequired,
  onQuerySelected: React.PropTypes.func,
  updateQueryProperty: React.PropTypes.func.isRequired,
  handleSearch: React.PropTypes.func.isRequired,
  handleDeleteQuery: React.PropTypes.func,
  handleOpen: React.PropTypes.func,
  loadEditLabelDialog: React.PropTypes.func,
  // from composition
  intl: React.PropTypes.object.isRequired,
  user: React.PropTypes.object,
};


export default
  injectIntl(
    QueryPickerLoggedInHeader
  );
