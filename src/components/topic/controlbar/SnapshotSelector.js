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

  getStyles() {
    const styles = {
      root: {
        color: '#ffffff',
        display: 'block',
        paddingLeft: 20,
        backgroundColor: '#303030',
      },
      label: {
        fontSize: 13,
        lineHeight: '48px',
        display: 'inline-block',
        verticalAlign: 'center',
      },
      popover: {
        height: 300,
        overflowY: 'scroll',
      },
    };
    return styles;
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
    const styles = this.getStyles();
    // default to select first if you need to
    let selected = null;
    for (const snapshot in snapshots) {
      if (snapshot.controversy_dumps_id === selectedId) {
        selected = snapshot;
        break;
      }
    }
    if (selected === null) {
      selected = snapshots[0];
    }
    return (
      <div style={styles.root}>
        <div style={styles.label}>
          {selected.dump_date.substr(0, 16)}
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
          style={styles.popover}
        >
          {snapshots.map(snapshot =>
            <SnapshotListItem key={snapshot.controversy_dumps_id} id={snapshot.controversy_dumps_id}
              name={snapshot.dump_date.substr(0, 16)} date={snapshot.dump_date.substr(0, 16)}
              onSnapshotSelected={() => { this.handleSnapshotSelected(snapshot.controversy_dumps_id); }}
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
