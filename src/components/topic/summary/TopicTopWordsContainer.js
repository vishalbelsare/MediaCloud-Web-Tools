import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import ErrorTryAgain from '../../util/ErrorTryAgain';
import LoadingSpinner from '../../util/LoadingSpinner';
import WordCloud from '../../vis/WordCloud';
import { fetchTopicTopWords } from '../../../actions/topicActions';
import * as fetchConstants from '../../../lib/fetchConstants.js';
import Paper from 'material-ui/Paper';
import messages from '../../../resources/messages';
import DownloadButton from '../../util/DownloadButton';

const localMessages = {
  title: { id: 'topic.summary.topWords.title', defaultMessage: 'Top Words' },
};

class TopicTopStoriesContainer extends React.Component {
  componentDidMount() {
    const { fetchStatus } = this.props;
    if (fetchStatus !== fetchConstants.FETCH_FAILED) {
      this.refetchData();
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.filters !== this.props.filters) {
      const { topicId, fetchData } = this.props;
      fetchData(topicId, nextProps.filters.snapshotId, nextProps.filters.timespanId);
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
  refetchData = () => {
    const { topicId, filters, fetchData } = this.props;
    fetchData(topicId, filters.snapshotId, filters.timespanId);
  }
  downloadCsv = () => {
    const { topicId, filters } = this.props;
    const url = `/api/topics/${topicId}/words.csv?snapshot=${filters.snapshotId}&timespan=${filters.timespanId}`;
    window.location = url;
  }
  render() {
    const { fetchStatus, words } = this.props;
    const { formatMessage } = this.props.intl;
    let content = fetchStatus;
    const styles = this.getStyles();
    let headerContent = null;
    switch (fetchStatus) {
      case fetchConstants.FETCH_SUCCEEDED:
        content = <WordCloud words={words} width={600} height={300} textColor={'#ff0000'} maxFontSize={32} />;
        headerContent = <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />;
        break;
      case fetchConstants.FETCH_FAILED:
        content = <ErrorTryAgain onTryAgain={this.refetchData} />;
        break;
      default:
        content = <LoadingSpinner />;
    }
    return (
      <div style={styles.root}>
        <Paper>
          <div style={styles.contentWrapper}>
            {headerContent}
            <h2><FormattedMessage {...localMessages.title} /></h2>
            {content}
          </div>
        </Paper>
      </div>
    );
  }
}

TopicTopStoriesContainer.propTypes = {
  fetchStatus: React.PropTypes.string.isRequired,
  words: React.PropTypes.array,
  topicId: React.PropTypes.number.isRequired,
  fetchData: React.PropTypes.func.isRequired,
  intl: React.PropTypes.object.isRequired,
  filters: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  fetchStatus: state.topics.selected.summary.topWords.fetchStatus,
  words: state.topics.selected.summary.topWords.list,
  filters: state.topics.selected.filters,
});

const mapDispatchToProps = (dispatch) => ({
  fetchData: (topicId, snapshotId, timespanId) => {
    if ((snapshotId !== null) && (timespanId !== null)) {
      dispatch(fetchTopicTopWords(topicId, snapshotId, timespanId));
    }
  },
});

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(TopicTopStoriesContainer));
