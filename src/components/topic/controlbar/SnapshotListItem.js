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
    const { id, onSnapshotSelected } = this.props;
    onSnapshotSelected(id);
  }

  render() {
    const { name, date } = this.props;
    const styles = this.getStyles();
    return (
      <div style={styles.root} onClick={this.handleClick}>
        <div style={styles.title}>{ name }</div>
        <small style={styles.subTitle}>
          <FormattedMessage {...messages.snapshotAge} values={{ age: moment(date).fromNow() }} />
        </small>
      </div>
    );
  }

}

SnapshotListItem.propTypes = {
  id: React.PropTypes.number.isRequired,
  name: React.PropTypes.string.isRequired,
  date: React.PropTypes.string.isRequired,
  onSnapshotSelected: React.PropTypes.func.isRequired,
};

export default injectIntl(SnapshotListItem);
