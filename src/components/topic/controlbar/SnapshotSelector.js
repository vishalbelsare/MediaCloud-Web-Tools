import React from 'react';
import { injectIntl } from 'react-intl';
import IconButton from 'material-ui/IconButton';
import { Popover, PopoverAnimationVertical } from 'material-ui/Popover';
import moment from 'moment';
import messages from '../../../resources/messages';
import SnapshotListItem from './SnapshotListItem';
import composeHelpfulContainer from '../../common/HelpfulContainer';

const localMessages = {
  helpTitle: { id: 'snapshot.selector.help.title', defaultMessage: 'About Snapshots' },
  helpText: { id: 'snapshot.selector.help.text',
    defaultMessage: '<p>A Snapshot is a fronze-in-time collection of all the content in your Topic.  You can\'t change anything within a Snapshot; you can just browse and explore it.  If you want to make any changes you need to generate a new Snapshot.  They are frozen-in-time so you can use them for reproduceable research; you wouldn\'t want your changing out from under you while you are analyzing it, or once you have published a report.</p><p>Click the arrow to see a popup list of the other Snapshots within this topic.  Click one from the list that appears to switch to it.</p>',
  },
};

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
    const { snapshots, selectedId, helpButton } = this.props;
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
          {selectedDate} {helpButton}
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
  helpButton: React.PropTypes.node.isRequired,
};

export default
  injectIntl(
    composeHelpfulContainer(localMessages.helpTitle, localMessages.helpText)(
      SnapshotSelector
    )
  );
