import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import moment from 'moment';
import messages from '../../../resources/messages';

const localMessages = {
  snapshotNotReady: { id: 'snapshot.notReady', defaultMessage: 'Not ready yet.' },
};

class SnapshotListItem extends React.Component {

  handleClick = (evt) => {
    evt.preventDefault();
    const { id, onSelected } = this.props;
    onSelected(id);
  }

  render() {
    const { snapshot, selected } = this.props;
    const { formatMessage } = this.props.intl;
    const label = snapshot.snapshot_date.substr(0, 16);
    const date = snapshot.snapshot_date.substr(0, 16);
    const isCompleted = (snapshot.state === 'completed');
    const stateMessage = (isCompleted) ? '' : formatMessage(localMessages.snapshotNotReady);
    const clickHandler = (isCompleted) ? this.handleClick : null;
    const disabledClass = (isCompleted) ? '' : 'disabled';
    const selectedClass = (selected === true) ? 'selected' : '';
    const rootClasses = `popup-item snapshot-item ${disabledClass} ${selectedClass}`;
    return (
      <div className={rootClasses} onClick={clickHandler}>
        <div className="title">{ label }</div>
        <small>{ stateMessage }</small>
        <small><FormattedMessage {...messages.snapshotAge} values={{ age: moment(date).fromNow() }} /></small>
      </div>
    );
  }

}

SnapshotListItem.propTypes = {
  intl: React.PropTypes.object.isRequired,
  id: React.PropTypes.number.isRequired,
  snapshot: React.PropTypes.object.isRequired,
  onSelected: React.PropTypes.func.isRequired,
  selected: React.PropTypes.bool,
};

export default injectIntl(SnapshotListItem);
