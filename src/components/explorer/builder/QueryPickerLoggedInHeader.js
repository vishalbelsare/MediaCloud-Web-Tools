import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import ColorPicker from '../../common/ColorPicker';


class QueryPickerLoggedInHeader extends React.Component {
  render() {
    const { query, isDeletable, onColorChange, onDelete, onLabelEditRequest } = this.props;
    // const { formatMessage } = this.props.intl;
    let nameInfo = <div />;
    let menuChildren = null;
    let iconOptions = null;
    if (isDeletable()) { // if this is not the only QueryPickerItem
      menuChildren = (
        <div>
          <MenuItem primaryText="Edit Query Label" onTouchTap={() => onLabelEditRequest()} />
          <MenuItem primaryText="Delete" onTouchTap={() => onDelete(query)} />
        </div>
      );
    } else {
      menuChildren = (
        <div>
          <MenuItem primaryText="Edit Query Label" onTouchTap={() => onLabelEditRequest()} />
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

      if (query) {
        nameInfo = (
          <div>
            <ColorPicker
              color={query.color}
              onChange={e => onColorChange(e.value)}
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
  query: PropTypes.object,
  isDeletable: PropTypes.func.isRequired,
  onColorChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  onLabelEditRequest: PropTypes.func,
  // from composition
  intl: PropTypes.object.isRequired,
};


export default
  injectIntl(
    QueryPickerLoggedInHeader
  );
