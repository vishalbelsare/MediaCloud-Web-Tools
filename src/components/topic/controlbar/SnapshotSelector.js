import React from 'react';
import { injectIntl } from 'react-intl';
import IconButton from 'material-ui/IconButton';
import { Popover, PopoverAnimationVertical } from 'material-ui/Popover';
import moment from 'moment';
import messages from '../../../resources/messages';
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
    const { formatMessage, formatDate } = this.props.intl;
    const icon = (this.state.isPopupOpen) ? 'arrow_drop_up' : 'arrow_drop_down';
    // default to select first if you need to
    let selected = snapshots.find((snapshot) => (snapshot.snapshots_id === selectedId));
    if (selected === null) {
      selected = snapshots[0];
    }
    let selectedDate = (selected !== undefined) ? formatDate(moment(selected.snapshot_date.substr(0, 16))) : '';
    return (
      <div className="snapshot-selector">
        <div className="label">
          {selectedDate}
        </div>
        <IconButton
          iconClassName="material-icons"
          tooltip={formatMessage(messages.snapshotChange)}
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
            <SnapshotListItem
              key={snapshot.snapshots_id}
              id={snapshot.snapshots_id}
              snapshot={snapshot}
              selected={snapshot.snapshots_id === selectedId}
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
