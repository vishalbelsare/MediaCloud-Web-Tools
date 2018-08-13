import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ActionMenu from './ActionMenu';
import { DownloadButton } from './IconButton';
import { downloadSvg } from '../util/svg';
import { ACTION_MENU_ITEM_CLASS } from '../../lib/explorerUtil';
import messages from '../../resources/messages';

const SVGAndCSVMenu = (props) => {
  const { downloadCsv, label, idx } = props.intl;
  return (
    <ActionMenu>
      <MenuItem
        key={idx}
        className={ACTION_MENU_ITEM_CLASS}
        onClick={() => downloadCsv(label)}
      >
        <ListItemText>
          <FormattedMessage {...messages.downloadCsv} values={{ name: label }} />
        </ListItemText>
        <ListItemIcon>
          <DownloadButton />
        </ListItemIcon>
      </MenuItem>
      <MenuItem
        key={idx}
        className={ACTION_MENU_ITEM_CLASS}
        onClick={() => downloadSvg(label)}
      >
        <ListItemText>
          <FormattedMessage {...messages.downloadCsv} values={{ name: label }} />
        </ListItemText>
        <ListItemIcon>
          <DownloadButton />
        </ListItemIcon>
      </MenuItem>
    </ActionMenu>
  );
};


SVGAndCSVMenu.propTypes = {
  children: PropTypes.node,
  intl: PropTypes.object.isRequired,
  downloadCsv: PropTypes.func.isRequired,
  downloadSvg: PropTypes.func,
  label: PropTypes.string,
  idx: PropTypes.number,
};

export default
  injectIntl(
    SVGAndCSVMenu
  );
