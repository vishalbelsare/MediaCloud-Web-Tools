import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../common/AsyncContainer';
import composeHelpfulContainer from '../../common/HelpfulContainer';
import AttentionOverTimeChart from '../../vis/AttentionOverTimeChart';
import { fetchMediaSentenceCounts } from '../../../actions/topicActions';
import messages from '../../../resources/messages';
import { DownloadButton } from '../../common/IconButton';
import DataCard from '../../common/DataCard';
import { getBrandDarkColor } from '../../../styles/colors';

const localMessages = {
  title: { id: 'media.sentenceCount.title', defaultMessage: 'Total Sentences in this Media Source' },
  helpTitle: { id: 'media.sentenceCount.help.title', defaultMessage: 'About Media Attention' },
  helpText: { id: 'media.sentenceCount.help.text',
    defaultMessage: '<p>This chart shows you the coverage of this Topic over time by this Media Source. This is the total number of sentences from this Media Source within this topic, which includes sentences that don\'t specifically match your query (but are in stories where at least one sentences does).</p>',
  },
};

class MediaSentenceCountContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { fetchData, filters } = this.props;
    if (nextProps.filters !== filters) {
      fetchData(nextProps);
    }
  }
  downloadCsv = () => {
    const { topicId, mediaId, filters } = this.props;
    const url = `/api/topics/${topicId}/media/${mediaId}/sentences/count.csv?snapshotId=${filters.snapshotId}&timespanId=${filters.timespanId}`;
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
        <AttentionOverTimeChart total={total} data={counts} height={200} lineColor={getBrandDarkColor()} />
      </DataCard>
    );
  }
}

MediaSentenceCountContainer.propTypes = {
  // from composition chain
  intl: PropTypes.object.isRequired,
  helpButton: PropTypes.node.isRequired,
  // passed in
  topicId: PropTypes.number.isRequired,
  mediaId: PropTypes.number.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  filters: PropTypes.object.isRequired,
  total: PropTypes.number,
  counts: PropTypes.array,
  // from dispath
  asyncFetch: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.mediaSource.sentenceCount.fetchStatus,
  total: state.topics.selected.mediaSource.sentenceCount.total,
  counts: state.topics.selected.mediaSource.sentenceCount.counts,
  filters: state.topics.selected.filters,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (stateProps) => {
    dispatch(fetchMediaSentenceCounts(ownProps.topicId, ownProps.mediaId, stateProps.filters));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(stateProps);
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      composeHelpfulContainer(localMessages.helpTitle, [localMessages.helpText, messages.attentionChartHelpText])(
        composeAsyncContainer(
          MediaSentenceCountContainer
        )
      )
    )
  );
