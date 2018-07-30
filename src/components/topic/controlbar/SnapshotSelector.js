import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { getBrandDarkerColor } from '../../../styles/colors';

const localMessages = {
  pickSnapshot: { id: 'snapshot.pick', defaultMessage: 'Load an Archived Snapshot' },
  snapshotNotReady: { id: 'snapshot.notReady', defaultMessage: 'Not ready ({state})' },
};

class SnapshotSelector extends React.Component {

  handleSnapshotSelected = (evt, index, value) => {
    const { onSnapshotSelected, snapshots } = this.props;
    onSnapshotSelected(snapshots.find(s => s.snapshots_id === value));
  }

  render() {
    const { snapshots, selectedId } = this.props;
    const { formatMessage, formatDate } = this.props.intl;
    // default to select first if you need to
    let selected = snapshots.find(snapshot => (snapshot.snapshots_id === selectedId));
    if (selected === null) {
      selected = snapshots[0];
    }
    return (
      <Select
        floatingLabelText={formatMessage(localMessages.pickSnapshot)}
        floatingLabelFixed
        floatingLabelStyle={{ color: 'rgb(224,224,224)', opacity: 0.8 }}
        selectedMenuItemStyle={{ color: getBrandDarkerColor(), fontWeight: 'bold' }}
        labelStyle={{ color: 'rgb(255,255,255)' }}
        value={selectedId}
        fullWidth
        onChange={this.handleSnapshotSelected}
      >
        {snapshots.map((snapshot) => {
          const formattedDateStr = formatDate(snapshot.snapshotDate, { month: 'short', year: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' });
          const stateMessage = (snapshot.isUsable) ? '' : `: ${formatMessage(localMessages.snapshotNotReady, { state: snapshot.state })}`;
          const noteMessage = (snapshot.note && snapshot.note.length > 0) ? `(${snapshot.note})` : '';
          return (
            <MenuItem
              disabled={!snapshot.isUsable}
              key={snapshot.snapshots_id}
              value={snapshot.snapshots_id}
              primaryText={`${formattedDateStr} ${stateMessage} ${noteMessage}`}
            />
          );
        })}
      </Select>

    );
  }

}

SnapshotSelector.propTypes = {
  snapshots: PropTypes.array.isRequired,
  selectedId: PropTypes.number,
  intl: PropTypes.object.isRequired,
  onSnapshotSelected: PropTypes.func,
};

export default
  injectIntl(
    SnapshotSelector
  );
