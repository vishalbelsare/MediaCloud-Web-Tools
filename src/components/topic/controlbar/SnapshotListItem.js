import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../resources/messages';
import moment from 'moment';

class SnapshotListItem extends React.Component {

  getStyles() {
    const styles = {
      root: {
        paddingLeft: 10,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#303030',
        borderBottom: '1px solid #303030',
        color: '#ffffff',
        fontSize: 13,
        cursor: 'pointer',
      },
      title: {
      },
      subTitle: {
        color: '#666666',
      },
    };
    return styles;
  }

  handleClick = (evt) => {
    evt.preventDefault();
    const { id, onSelected } = this.props;
    onSelected(id);
  }

  render() {
    const { snapshot } = this.props;
    const styles = this.getStyles();
    const label = snapshot.snapshot_date.substr(0, 16);
    const date = snapshot.snapshot_date.substr(0, 16);
    const state = snapshot.sate;
    return (
      <div style={styles.root} onClick={this.handleClick}>
        <div style={styles.title}>{ label }</div>
        <small style={styles.subTitle}>{ state }</small>
        <small style={styles.subTitle}>
          <FormattedMessage {...messages.snapshotAge} values={{ age: moment(date).fromNow() }} />
        </small>
      </div>
    );
  }

}

SnapshotListItem.propTypes = {
  id: React.PropTypes.number.isRequired,
  snapshot: React.PropTypes.object.isRequired,
  onSelected: React.PropTypes.func.isRequired,
};

export default injectIntl(SnapshotListItem);
