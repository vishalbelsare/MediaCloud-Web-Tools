import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import ColorPicker from '../../common/ColorPicker';
import messages from '../../../resources/messages';
import { QUERY_LABEL_CHARACTER_LIMIT } from '../../../lib/explorerUtil';

const localMessages = {
  title: { id: 'explorer.querypicker.title', defaultMessage: 'Rename Query' },
};

class QueryPickerLoggedInHeader extends React.Component {
  render() {
    const { query, isDeletable, onColorChange, onDelete, onLabelEditRequest } = this.props;
    const { formatMessage } = this.props.intl;
    let nameInfo = <div />;
    let menuChildren = null;
    let iconOptions = null;
    if (isDeletable()) { // if this is not the only QueryPickerItem
      menuChildren = (
        <div>
          <MenuItem primaryText={formatMessage(localMessages.title)} onTouchTap={() => onLabelEditRequest()} />
          <MenuItem primaryText={formatMessage(messages.delete)} onTouchTap={() => onDelete(query)} />
        </div>
      );
    } else {
      menuChildren = (
        <div>
          <MenuItem primaryText={formatMessage(localMessages.title)} onTouchTap={() => onLabelEditRequest()} />
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
      let abbrevQuery = query.label;
      if (abbrevQuery.length > QUERY_LABEL_CHARACTER_LIMIT) {
        abbrevQuery = abbrevQuery.slice(0, QUERY_LABEL_CHARACTER_LIMIT).join('...');
      }
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
              {abbrevQuery}
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
