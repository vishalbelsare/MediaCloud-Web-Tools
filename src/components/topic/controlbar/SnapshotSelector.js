import React from 'react';
import { injectIntl } from 'react-intl';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { getBrandDarkerColor } from '../../../styles/colors';
import { textualFormattedDate } from '../../../lib/dateUtil';

const localMessages = {
  pickSnapshot: { id: 'snapshot.pick', defaultMessage: 'Load an Archived Snapshot' },
  snapshotNotReady: { id: 'snapshot.notReady', defaultMessage: 'Not ready yet.' },
};

class SnapshotSelector extends React.Component {

  handleSnapshotSelected = (evt, index, value) => {
    const { onSnapshotSelected, snapshots } = this.props;
    onSnapshotSelected(snapshots.find(s => s.snapshots_id === value));
  }

  render() {
    const { snapshots, selectedId } = this.props;
    const { formatMessage } = this.props.intl;
    // default to select first if you need to
    let selected = snapshots.find(snapshot => (snapshot.snapshots_id === selectedId));
    if (selected === null) {
      selected = snapshots[0];
    }
    return (
      <SelectField
        floatingLabelText={formatMessage(localMessages.pickSnapshot)}
        floatingLabelFixed
        floatingLabelStyle={{ color: 'rgb(224,224,224)', opacity: 0.8 }}
        selectedMenuItemStyle={{ color: getBrandDarkerColor(), fontWeight: 'bold' }}
        labelStyle={{ color: 'rgb(255,255,255)' }}
        value={selectedId}
        onChange={this.handleSnapshotSelected}
      >
        {snapshots.map((snapshot) => {
          const dateStr = snapshot.snapshot_date.substr(0, 16);
          const formattedDateStr = textualFormattedDate(dateStr);
          const stateMessage = (snapshot.isUsable) ? '' : formatMessage(localMessages.snapshotNotReady);
          return (
            <MenuItem
              disabled={!snapshot.isUsable}
              key={snapshot.snapshots_id}
              value={snapshot.snapshots_id}
              primaryText={`${formattedDateStr} ${stateMessage}`}
            />
          );
        })}
      </SelectField>

    );
  }

}

SnapshotSelector.propTypes = {
  snapshots: React.PropTypes.array.isRequired,
  selectedId: React.PropTypes.number,
  intl: React.PropTypes.object.isRequired,
  onSnapshotSelected: React.PropTypes.func,
};

export default
  injectIntl(
    SnapshotSelector
  );
