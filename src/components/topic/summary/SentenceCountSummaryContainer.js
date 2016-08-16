import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../common/AsyncContainer';
import AttentionOverTimeChart from '../../vis/AttentionOverTimeChart';
import { fetchTopicSentenceCounts } from '../../../actions/topicActions';
import messages from '../../../resources/messages';
import DownloadButton from '../../common/DownloadButton';
import DataCard from '../../common/DataCard';
import { getBrandDarkColor } from '../../../styles/colors';

const localMessages = {
  title: { id: 'topic.summary.sentenceCount.title', defaultMessage: 'Sentences Over Time' },
};

class SentenceCountSummaryContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { filters, fetchData } = this.props;
    if (nextProps.filters.timespanId !== filters.timespanId) {
      fetchData(nextProps);
    }
  }
  getStyles() {
    const styles = {
      clearFix: {
        clear: 'both',
      },
    };
    return styles;
  }
  downloadCsv = (event) => {
    const { topicId, filters } = this.props;
    event.preventDefault();
    const url = `/api/topics/${topicId}/sentences/count.csv?snapshotId=${filters.snapshotId}&timespanId=${filters.timespanId}`;
    window.location = url;
  }
  render() {
    const { total, counts } = this.props;
    const { formatMessage } = this.props.intl;
    const styles = this.getStyles();
    return (
      <DataCard>
        <div className="actions">
          <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />
        </div>
        <h2><FormattedMessage {...localMessages.title} /></h2>
        <div style={styles.clearFix} />
        <AttentionOverTimeChart total={total} data={counts} height={200}
          lineColor={ getBrandDarkColor() }
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
  // from context
  intl: React.PropTypes.object.isRequired,
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
      composeAsyncContainer(
        SentenceCountSummaryContainer
      )
    )
  );
