import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../common/AsyncContainer';
import composeHelpfulContainer from '../../common/HelpfulContainer';
import AttentionOverTimeChart from '../../vis/AttentionOverTimeChart';
import { fetchTopicSentenceCounts } from '../../../actions/topicActions';
import composeSaveableContainer from '../../common/SaveableContainer';
import messages from '../../../resources/messages';
import Permissioned from '../../common/Permissioned';
import { PERMISSION_LOGGED_IN } from '../../../lib/auth';
import { DownloadButton, ExploreButton } from '../../common/IconButton';
import DataCard from '../../common/DataCard';
import { getBrandDarkColor } from '../../../styles/colors';
import { filteredLinkTo, filtersAsUrlParams } from '../../util/location';

const localMessages = {
  title: { id: 'topic.summary.sentenceCount.title', defaultMessage: 'Topic Attention' },
  helpTitle: { id: 'topic.summary.sentenceCount.help.title', defaultMessage: 'About Attention' },
  helpText: { id: 'topic.summary.sentenceCount.help.text',
    defaultMessage: '<p>This chart shows you the coverage of this Topic over time.</p>',
  },
};

class SentenceCountSummaryContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { filters, fetchData, counts, setDataToSave } = this.props;
    const { formatMessage } = this.props.intl;
    if (nextProps.filters.timespanId !== filters.timespanId) {
      fetchData(nextProps);
    }
    if ((counts) && (counts !== nextProps.counts)) {
      // update data on save container if you need to
      setDataToSave({
        type: 'AttentionOverTimeChart',
        data: nextProps.counts,
        topicId: nextProps.topicId,
        title: formatMessage(localMessages.title),
        ...nextProps.filters,
      });
    }
  }
  downloadCsv = () => {
    const { topicId, filters } = this.props;
    const url = `/api/topics/${topicId}/sentences/count.csv?${filtersAsUrlParams(filters)}`;
    window.location = url;
  }
  render() {
    const { total, counts, helpButton, topicId, filters, savedFeedback, saveToNotebookButton } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <DataCard>
        <Permissioned onlyRole={PERMISSION_LOGGED_IN}>
          <div className="actions">
            <ExploreButton linkTo={filteredLinkTo(`/topics/${topicId}/attention`, filters)} />
            <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />
            {saveToNotebookButton}
          </div>
        </Permissioned>
        <h2>
          <FormattedMessage {...localMessages.title} />
          {helpButton}
        </h2>
        {savedFeedback}
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
  // from composition chain
  intl: React.PropTypes.object.isRequired,
  helpButton: React.PropTypes.node.isRequired,
  saveToNotebookButton: React.PropTypes.node.isRequired,
  savedFeedback: React.PropTypes.node.isRequired,
  setDataToSave: React.PropTypes.func.isRequired,
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
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.summary.sentenceCount.fetchStatus,
  total: state.topics.selected.summary.sentenceCount.total,
  counts: state.topics.selected.summary.sentenceCount.counts,
});

const mapDispatchToProps = dispatch => ({
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
      composeHelpfulContainer(localMessages.helpTitle, [localMessages.helpText, messages.attentionChartHelpText])(
        composeAsyncContainer(
          composeSaveableContainer(
            SentenceCountSummaryContainer
          )
        )
      )
    )
  );
