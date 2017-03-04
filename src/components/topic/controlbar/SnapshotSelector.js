import React from 'react';
import { injectIntl } from 'react-intl';
import moment from 'moment';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const localMessages = {
  pickSnapshot: { id: 'snapshot.pick', defaultMessage: 'Load an Archived Snapshot' },
};

class SnapshotSelector extends React.Component {

  handleSnapshotSelected = (evt, index, value) => {
    this.handlePopupRequestClose();
    const { onSnapshotSelected } = this.props;
    onSnapshotSelected(value);
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
      <div className="snapshot-selector">
        <SelectField
          floatingLabelText={formatMessage(localMessages.pickSnapshot)}
          floatingLabelFixed
          floatingLabelStyle={{ color: 'rgb(224,224,224)' }}
          labelStyle={{ color: 'rgb(255,255,255)' }}
          value={selectedId}
          onChange={this.handleSnapshotSelected}
        >
          {snapshots.map((snapshot) => {
            const date = snapshot.snapshot_date.substr(0, 16);
            const label = `${snapshot.snapshot_date.substr(0, 16)} (${moment(date).fromNow()})`;
            return (
              <MenuItem
                key={snapshot.snapshots_id}
                value={snapshot.snapshots_id}
                primaryText={label}
              />
            );
          })}
        </SelectField>
      </div>
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
