import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../common/AsyncContainer';
import AttentionOverTimeChart from '../../vis/AttentionOverTimeChart';
import { fetchMediaSentenceCounts } from '../../../actions/topicActions';
import messages from '../../../resources/messages';
import { DownloadButton } from '../../common/IconButton';
import DataCard from '../../common/DataCard';
import { getBrandDarkColor } from '../../../styles/colors';

const localMessages = {
  title: { id: 'media.sentenceCount.title', defaultMessage: 'Sentences Over Time' },
};

class MediaSentenceCountContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { fetchData, filters } = this.props;
    if (nextProps.filters.timespanId !== filters.timespanId) {
      fetchData(nextProps);
    }
  }
  downloadCsv = () => {
    const { topicId, mediaId, filters } = this.props;
    const url = `/api/topics/${topicId}/media/${mediaId}/sentences/count.csv?snapshotId=${filters.snapshotId}&timespanId=${filters.timespanId}`;
    window.location = url;
  }
  render() {
    const { total, counts } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <DataCard>
        <div className="actions">
          <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />
        </div>
        <h2><FormattedMessage {...localMessages.title} /></h2>
        <AttentionOverTimeChart total={total} data={counts} height={200} lineColor={getBrandDarkColor()} />
      </DataCard>
    );
  }
}

MediaSentenceCountContainer.propTypes = {
  // passed in
  topicId: React.PropTypes.number.isRequired,
  mediaId: React.PropTypes.number.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  filters: React.PropTypes.object.isRequired,
  total: React.PropTypes.number,
  counts: React.PropTypes.array,
  // from dispath
  asyncFetch: React.PropTypes.func.isRequired,
  fetchData: React.PropTypes.func.isRequired,
  // from context
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
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
      composeAsyncContainer(
        MediaSentenceCountContainer
      )
    )
  );
