import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import ErrorTryAgain from '../../util/ErrorTryAgain';
import LoadingSpinner from '../../util/LoadingSpinner';
import SentenceCount from '../../vis/SentenceCount';
import { fetchSentenceCounts } from '../../../actions/sourceActions';
import * as fetchConstants from '../../../lib/fetchConstants.js';
import Paper from 'material-ui/Paper';

const localMessages = {
  title: { id: 'sentenceCount.title', defaultMessage: 'Sentences Over Time' },
};

class SentenceCountContainer extends React.Component {
  componentDidMount() {
    const { fetchStatus, itemId, filters, fetchData } = this.props;
    if (fetchStatus !== fetchConstants.FETCH_FAILED) {
      fetchData(itemId, filters.snapshotId, filters.timespanId);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.filters !== this.props.filters) {
      const { itemId, fetchData } = this.props;
      fetchData(itemId, nextProps.filters.snapshotId, nextProps.filters.timespanId);
    }
  }
  getStyles() {
    const styles = {
      contentWrapper: {
        padding: 10,
      },
    };
    return styles;
  }
  render() {
    const { itemId, fetchStatus, fetchData, total, counts } = this.props;
    let content = fetchStatus;
    const styles = this.getStyles();
    switch (fetchStatus) {
      case fetchConstants.FETCH_SUCCEEDED:
        content = <SentenceCount total={total} counts={counts} />;
        break;
      case fetchConstants.FETCH_FAILED:
        content = <ErrorTryAgain onTryAgain={fetchData(itemId)} />;
        break;
      default:
        content = <LoadingSpinner />;
    }
    return (
      <div style={styles.root}>
        <Paper>
          <div style={styles.contentWrapper}>
            <h2><FormattedMessage {...localMessages.title} /></h2>
            {content}
          </div>
        </Paper>
      </div>
    );
  }
}

SentenceCountContainer.propTypes = {
  fetchStatus: React.PropTypes.string.isRequired,
  total: React.PropTypes.number,
  counts: React.PropTypes.array,
  itemId: React.PropTypes.number.isRequired,
  fetchData: React.PropTypes.func.isRequired,
  intl: React.PropTypes.object.isRequired,
  filters: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  fetchStatus: state.topics.selected.summary.sentenceCount.fetchStatus,
  total: state.topics.selected.summary.sentenceCount.total,
  counts: state.topics.selected.summary.sentenceCount.list,
  filters: state.topics.selected.filters,
});

const mapDispatchToProps = (dispatch) => ({
  fetchData: (itemId, snapshotId, timespanId) => {
    if ((snapshotId !== null) && (timespanId !== null)) {
      dispatch(fetchSentenceCounts(itemId, snapshotId, timespanId));
    }
  },
});

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(SentenceCountContainer));
