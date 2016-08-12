import React from 'react';
import { injectIntl } from 'react-intl';
import messages from '../../../resources/messages';
import IconButton from 'material-ui/IconButton';
import { Popover, PopoverAnimationVertical } from 'material-ui/Popover';
import SnapshotListItem from './SnapshotListItem';

class SnapshotSelector extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isPopupOpen: false,
    };
  }

  handlePopupOpenClick = (event) => {
    event.preventDefault();
    this.setState({
      isPopupOpen: !this.state.isPopupOpen,
      anchorEl: event.currentTarget,
    });
  }

  handlePopupRequestClose = () => {
    this.setState({
      isPopupOpen: false,
    });
  }

  handleSnapshotSelected = (snapshotId) => {
    this.handlePopupRequestClose();
    const { onSnapshotSelected } = this.props;
    onSnapshotSelected(snapshotId);
  }

  render() {
    const { snapshots, selectedId } = this.props;
    const { formatMessage } = this.props.intl;
    const icon = (this.state.isPopupOpen) ? 'arrow_drop_up' : 'arrow_drop_down';
    // default to select first if you need to
    let selected = null;
    for (const idx in snapshots) {
      if (snapshots[idx].snapshots_id === selectedId) {
        selected = snapshots[idx];
        break;
      }
    }
    if (selected === null) {
      selected = snapshots[0];
    }
    return (
      <div className="snapshot-selector">
        <div className="label">
          {selected.snapshot_date.substr(0, 16)}
        </div>
        <IconButton
          iconClassName="material-icons" tooltip={formatMessage(messages.snapshotChange)}
          onClick={this.handlePopupOpenClick}
          iconStyle={{ color: 'white' }}
        >
          {icon}
        </IconButton>
        <Popover
          open={this.state.isPopupOpen}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'left', vertical: 'top' }}
          onRequestClose={this.handlePopupRequestClose}
          animation={PopoverAnimationVertical}
          className="popup-list"
        >
          {snapshots.map(snapshot =>
            <SnapshotListItem key={snapshot.snapshots_id} snapshot={snapshot}
              selected={snapshot.snapshots_id === selected.snapshots_id}
              onSelected={() => { this.handleSnapshotSelected(snapshot.snapshots_id); }}
            />
          )}
        </Popover>
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

export default injectIntl(SnapshotSelector);
