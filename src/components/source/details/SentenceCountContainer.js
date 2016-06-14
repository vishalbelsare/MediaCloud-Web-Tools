import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import ErrorTryAgain from '../../util/ErrorTryAgain';
import LoadingSpinner from '../../util/LoadingSpinner';
import SentenceCount from '../../vis/SentenceCount';
import { fetchSourceSentenceCount } from '../../../actions/sourceActions';
import * as fetchConstants from '../../../lib/fetchConstants.js';
import Paper from 'material-ui/Paper';

const localMessages = {
  title: { id: 'sentenceCount.title', defaultMessage: 'Sentences Over Time' },
};

class SentenceCountContainer extends React.Component {
  componentDidMount() {
    const { fetchStatus, sourceId, filters, fetchData } = this.props;
    if (fetchStatus !== fetchConstants.FETCH_FAILED) {
      fetchData(sourceId, filters.snapshotId, filters.timespanId);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.filters !== this.props.filters) {
      const { sourceId, fetchData } = this.props;
      fetchData(sourceId, nextProps.filters.snapshotId, nextProps.filters.timespanId);
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
    const { sourceId, fetchStatus, fetchData, total, counts } = this.props;
    let content = fetchStatus;
    const styles = this.getStyles();
    switch (fetchStatus) {
      case fetchConstants.FETCH_SUCCEEDED:
        content = <SentenceCount total={total} counts={counts} />;
        break;
      case fetchConstants.FETCH_FAILED:
        // content = <ErrorTryAgain onTryAgain={fetchData(sourceId)} />;
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
  sourceId: React.PropTypes.string.isRequired,
  fetchData: React.PropTypes.func.isRequired,
  intl: React.PropTypes.object.isRequired,
  filters: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  fetchStatus: state.sources.selected.details.sentenceCount.fetchStatus,
  total: state.sources.selected.details.sentenceCount.total,
  counts: state.sources.selected.details.sentenceCount.list,
  filters: state.sources.selected.filters,
});

const mapDispatchToProps = (dispatch) => ({
  fetchData: (sourceId, snapshotId, timespanId) => {
   // if ((snapshotId !== null) && (timespanId !== null)) {
      dispatch(fetchSourceSentenceCount(sourceId, null, null));
   // }
  },
});

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(SentenceCountContainer));
