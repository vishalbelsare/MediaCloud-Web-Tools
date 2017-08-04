import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../common/AsyncContainer';
import composeHelpfulContainer from '../../common/HelpfulContainer';
import AttentionOverTimeChart from '../../vis/AttentionOverTimeChart';
import { fetchWordSentenceCounts } from '../../../actions/topicActions';
import messages from '../../../resources/messages';
import { DownloadButton } from '../../common/IconButton';
import DataCard from '../../common/DataCard';
import { getBrandDarkColor } from '../../../styles/colors';
import { filtersAsUrlParams } from '../../util/location';

const localMessages = {
  title: { id: 'word.sentenceCount.title', defaultMessage: 'Sentences that Use this Word' },
  helpTitle: { id: 'word.sentenceCount.help.title', defaultMessage: 'About Word Attention' },
  helpText: { id: 'word.sentenceCount.help.text',
    defaultMessage: '<p>This chart shows you the sentences within this Topic that include this word.</p>',
  },
};

class WordSentenceCountContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { fetchData, filters } = this.props;
    if (nextProps.filters.timespanId !== filters.timespanId ||
      (nextProps.stem !== this.props.stem)) {
      fetchData(nextProps);
    }
  }
  downloadCsv = () => {
    const { topicId, term, filters } = this.props;
    const url = `/api/topics/${topicId}/words/${term}*/sentences/count.csv?${filtersAsUrlParams(filters)}`;
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

WordSentenceCountContainer.propTypes = {
  // from composition chain
  intl: PropTypes.object.isRequired,
  helpButton: PropTypes.node.isRequired,
  // passed in
  topicId: PropTypes.number.isRequired,
  term: PropTypes.string.isRequired,
  stem: PropTypes.string.isRequired,  // from state
  fetchStatus: PropTypes.string.isRequired,
  filters: PropTypes.object.isRequired,
  total: PropTypes.number,
  counts: PropTypes.array,
  // from dispath
  asyncFetch: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  params: PropTypes.object,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.word.sentenceCount.fetchStatus,
  total: state.topics.selected.word.sentenceCount.total,
  counts: state.topics.selected.word.sentenceCount.counts,
  filters: state.topics.selected.filters,
  stem: state.topics.selected.word.info.stem,
  term: state.topics.selected.word.info.term,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (stateProps) => {
    const params = {
      ...stateProps.filters,
      sort: stateProps.sort,
    };
    dispatch(fetchWordSentenceCounts(ownProps.topicId, stateProps.stem, params));
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
      composeHelpfulContainer(localMessages.helpTitle, localMessages.helpText)(
        composeAsyncContainer(
          WordSentenceCountContainer
        )
      )
    )
  );

