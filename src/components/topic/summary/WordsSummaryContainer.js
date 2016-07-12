import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncWidget from '../../util/composeAsyncWidget';
import WordCloud from '../../vis/WordCloud';
import { fetchTopicTopWords } from '../../../actions/topicActions';
import Paper from 'material-ui/Paper';
import messages from '../../../resources/messages';
import DownloadButton from '../../util/DownloadButton';
import { getBrandDarkColor } from '../../../styles/colors';

const localMessages = {
  title: { id: 'topic.summary.topWords.title', defaultMessage: 'Top Words' },
};

class WordsSummaryContainer extends React.Component {
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
      actionButtons: {
        float: 'right',
      },
    };
    return styles;
  }
  downloadCsv = () => {
    const { topicId, filters } = this.props;
    const url = `/api/topics/${topicId}/words.csv?snapshot=${filters.snapshotId}&timespan=${filters.timespanId}`;
    window.location = url;
  }
  render() {
    const { words } = this.props;
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
            <WordCloud words={words} width={600} height={300} textColor={getBrandDarkColor()} maxFontSize={32} />
          </div>
        </Paper>
      </div>
    );
  }
}

WordsSummaryContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  // from parent
  topicId: React.PropTypes.number.isRequired,
  filters: React.PropTypes.object.isRequired,
  // from dispatch
  asyncFetch: React.PropTypes.func.isRequired,
  fetchData: React.PropTypes.func.isRequired,
  // from state
  words: React.PropTypes.array,
  fetchStatus: React.PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  fetchStatus: state.topics.selected.summary.topWords.fetchStatus,
  words: state.topics.selected.summary.topWords.list,
  filters: state.topics.selected.filters,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  asyncFetch: () => {
    dispatch(fetchTopicTopWords(ownProps.topicId, ownProps.filters.snapshotId, ownProps.filters.timespanId));
  },
  fetchData: (props) => {
    dispatch(fetchTopicTopWords(props.topicId, props.filters.snapshotId, props.filters.timespanId));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeAsyncWidget(
        WordsSummaryContainer
      )
    )
  );
