import React from 'react';
import { injectIntl } from 'react-intl';
import { Popover, PopoverAnimationVertical } from 'material-ui/Popover';
import IconButton from 'material-ui/IconButton';
import moment from 'moment';
import messages from '../../../resources/messages';
import SnapshotListItem from './SnapshotListItem';
// import { ArrowDropUpButton, ArrowDropDownButton } from '../../common/IconButton';
import { getBrandDarkColor } from '../../../styles/colors';

class SnapshotSelector extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isPopupOpen: false,
    };
  }

  handlePopupOpenClick = (event) => {
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
    /* let navControl = null;
    if (this.state.isPopupOpen) {
      navControl = (<ArrowDropUpButton
        onClick={this.handlePopupOpenClick}
        tooltip={formatMessage(messages.snapshotChange)}
        color={getBrandDarkColor()}
        style={{ position: 'relative' }}
      />);
    } else {
      navControl = (<ArrowDropDownButton
        onClick={this.handlePopupOpenClick}
        tooltip={formatMessage(messages.snapshotChange)}
        color={getBrandDarkColor()}
        style={{ position: 'relative' }}
      />);
    }*/
    // default to select first if you need to
    let selected = snapshots.find(snapshot => (snapshot.snapshots_id === selectedId));
    if (selected === null) {
      selected = snapshots[0];
    }
    const selectedDate = (selected !== undefined) ? formatDate(moment(selected.snapshot_date.substr(0, 16))) : '';
    return (
      <div className="popup-selector snapshot-selector">
        <div className="label">
          {selectedDate}
        </div>
        <IconButton
          iconClassName="material-icons"
          tooltip={formatMessage(messages.snapshotChange)}
          onClick={this.handlePopupOpenClick}
          iconStyle={{ color: getBrandDarkColor() }}
        >
          {icon}
        </IconButton>
        <Popover
          open={this.state.isPopupOpen}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'right', vertical: 'top' }}
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

export default
  injectIntl(
    SnapshotSelector
  );
