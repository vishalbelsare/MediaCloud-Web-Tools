import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../common/AsyncContainer';
import composeHelpfulContainer from '../../common/HelpfulContainer';
import AttentionOverTimeChart from '../../vis/AttentionOverTimeChart';
import { fetchTopicSentenceCounts } from '../../../actions/topicActions';
import messages from '../../../resources/messages';
import { DownloadButton } from '../../common/IconButton';
import DataCard from '../../common/DataCard';
import { getBrandDarkColor } from '../../../styles/colors';

const localMessages = {
  title: { id: 'topic.summary.sentenceCount.title', defaultMessage: 'Sentences Over Time' },
  helpTitle: { id: 'topic.summary.sentenceCount.help.title', defaultMessage: 'About Sentences Over Time' },
  helpText: { id: 'topic.summary.sentenceCount.help.text',
    defaultMessage: '<p>This chart shows you the attention paid to this topic over time. The vertical axis shows the number of sentences that are about the topic in the stories we have collected.</p><p>Roll over the line chart to see the sentences per day in each timespan shown on the graph.  Click the three lines in the top right of the chart to export it.</p>',
  },
};

class SentenceCountSummaryContainer extends React.Component {
  state = {
    open: false,
  };
  componentWillReceiveProps(nextProps) {
    const { filters, fetchData } = this.props;
    if (nextProps.filters.timespanId !== filters.timespanId) {
      fetchData(nextProps);
    }
  }
  handleOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    this.setState({ open: false });
  };
  downloadCsv = () => {
    const { topicId, filters } = this.props;
    const url = `/api/topics/${topicId}/sentences/count.csv?snapshotId=${filters.snapshotId}&timespanId=${filters.timespanId}`;
    window.location = url;
  }
  render() {
    const { total, counts, helpButton } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <DataCard>
        <div className="actions">
          <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />
        </div>
        <h2>
          <FormattedMessage {...localMessages.title} />
          {helpButton}
        </h2>
        <AttentionOverTimeChart
          total={total}
          data={counts}
          height={200}
          lineColor={getBrandDarkColor()}
        />
      </DataCard>
    );
  }
}

SentenceCountSummaryContainer.propTypes = {
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
  // from composition chain
  intl: React.PropTypes.object.isRequired,
  helpButton: React.PropTypes.node.isRequired,
};

const mapStateToProps = (state) => ({
  fetchStatus: state.topics.selected.summary.sentenceCount.fetchStatus,
  total: state.topics.selected.summary.sentenceCount.total,
  counts: state.topics.selected.summary.sentenceCount.counts,
});

const mapDispatchToProps = (dispatch) => ({
  fetchData: (props) => {
    dispatch(fetchTopicSentenceCounts(props.topicId, props.filters));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(ownProps);
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      composeHelpfulContainer(localMessages.helpTitle, localMessages.helpText)(
        composeAsyncContainer(
          SentenceCountSummaryContainer
        )
      )
    )
  );
