import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncWidget from '../../util/composeAsyncWidget';
import TopicSentenceCount from './TopicSentenceCount';
import { fetchTopicSentenceCounts } from '../../../actions/topicActions';
import Paper from 'material-ui/Paper';
import messages from '../../../resources/messages';
import DownloadButton from '../../util/DownloadButton';

const localMessages = {
  title: { id: 'topic.summary.sentenceCount.title', defaultMessage: 'Sentences Over Time' },
};

class TopicSentenceCountContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { fetchData } = this.props;
    if (nextProps.filters !== this.props.filters) {
      fetchData(nextProps);
    }
  }
  getStyles() {
    const styles = {
      contentWrapper: {
        padding: 10,
      },
      clearFix: {
        clear: 'both',
      },
      actionButtons: {
        float: 'right',
      },
    };
    return styles;
  }
  downloadCsv = () => {
    const { topicId, filters } = this.props;
    const url = `/api/topics/${topicId}/sentences/count.csv?snapshot=${filters.snapshotId}&timespan=${filters.timespanId}`;
    window.location = url;
  }
  render() {
    const { total, counts } = this.props;
    const { formatMessage } = this.props.intl;
    const styles = this.getStyles();
    return (
      <div style={styles.root}>
        <Paper>
          <div style={styles.contentWrapper}>
            <div style={styles.actionButtons}>
              <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />
            </div>
            <h2><FormattedMessage {...localMessages.title} /></h2>
            <div style={styles.clearFix} />
            <TopicSentenceCount total={total} counts={counts} />
          </div>
        </Paper>
      </div>
    );
  }
}

TopicSentenceCountContainer.propTypes = {
  // passed in
  topicId: React.PropTypes.number.isRequired,
  filters: React.PropTypes.object.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  total: React.PropTypes.number,
  counts: React.PropTypes.array,
  // from dispath
  asyncFetch: React.PropTypes.func.isRequired,
  fetchData: React.PropTypes.func.isRequired,
  // from context
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  fetchStatus: state.topics.selected.summary.sentenceCount.fetchStatus,
  total: state.topics.selected.summary.sentenceCount.total,
  counts: state.topics.selected.summary.sentenceCount.counts,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  asyncFetch: () => {
    dispatch(fetchTopicSentenceCounts(ownProps.topicId, ownProps.filters.snapshotId, ownProps.filters.timespanId));
  },
  fetchData: (props) => {
    dispatch(fetchTopicSentenceCounts(props.topicId, props.filters.snapshotId, props.filters.timespanId));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeAsyncWidget(
        TopicSentenceCountContainer
      )
    )
  );
