import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import composeAsyncContainer from '../../common/AsyncContainer';
import composeDescribedDataCard from '../../common/DescribedDataCard';
import composeCsvDownloadNotifyContainer from '../../common/composers/CsvDownloadNotifyContainer';
import EditableWordCloudDataCard from '../../common/EditableWordCloudDataCard';
import { fetchTopicTopWords } from '../../../actions/topicActions';
import messages from '../../../resources/messages';
import { filteredLinkTo, filtersAsUrlParams } from '../../util/location';
import { generateParamStr } from '../../../lib/apiUtil';
import { topicDownloadFilename } from '../../util/topicUtil';

const localMessages = {
  descriptionIntro: { id: 'topic.summary.words.help.into',
    defaultMessage: 'Look at the top words to see how this topic was talked about. This can suggest what the dominant narrative was, and looking at different timespans can suggest how it evolved over time.',
  },
};
const WORD_CLOUD_DOM_ID = 'topic-summary-word-cloud';

class WordsSummaryContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { filters, fetchData } = this.props;
    if (nextProps.filters !== filters) {
      fetchData(nextProps);
    }
  }
  render() {
    const { topicId, filters, words, handleWordCloudClick, topicName, fetchData, initSampleSize } = this.props;
    const { formatMessage } = this.props.intl;
    const urlDownload = `/api/topics/${topicId}/words.csv?${filtersAsUrlParams(filters)}`;
    return (
      <EditableWordCloudDataCard
        words={words}
        explore={filteredLinkTo(`/topics/${topicId}/words`, filters)}
        downloadUrl={urlDownload}
        onViewModeClick={handleWordCloudClick}
        onViewSampleSizeClick={sampleSize => fetchData({ topicId, filters, sample_size: sampleSize })}
        initSampleSize={initSampleSize}
        title={formatMessage(messages.topWords)}
        domId={WORD_CLOUD_DOM_ID}
        width={720}
        svgDownloadPrefix={`${topicDownloadFilename(topicName, filters)}-words`}
      />
    );
  }
}

WordsSummaryContainer.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  // from parent
  topicId: PropTypes.number.isRequired,
  topicName: PropTypes.string.isRequired,
  filters: PropTypes.object.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  maxFontSize: PropTypes.number,
  minFontSize: PropTypes.number,
  // from dispatch
  asyncFetch: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  initSampleSize: PropTypes.string,
  // from state
  words: PropTypes.array,
  fetchStatus: PropTypes.string.isRequired,
  handleWordCloudClick: PropTypes.func,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.summary.topWords.fetchStatus,
  words: state.topics.selected.summary.topWords.list,
  initSampleSize: state.topics.selected.summary.topWords.sample_size,
  filters: state.topics.selected.filters,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (props) => {
    dispatch(fetchTopicTopWords(props.topicId, { ...props.filters, sample_size: props.sample_size }));
  },
  asyncFetch: () => {
    dispatch(fetchTopicTopWords(ownProps.topicId, ownProps.filters));
  },
  pushToUrl: url => dispatch(push(url)),
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    handleWordCloudClick: (word) => {
      const params = generateParamStr({ ...stateProps.filters, stem: word.stem, term: word.term });
      const url = `/topics/${ownProps.topicId}/words/${word.stem}*?${params}`;
      dispatchProps.pushToUrl(url);
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      composeDescribedDataCard(localMessages.descriptionIntro,
        [messages.wordcloudHelpText, messages.wordCloudTopicWord2VecLayoutHelp])(
        composeAsyncContainer(
          composeCsvDownloadNotifyContainer(
            WordsSummaryContainer
          )
        )
      )
    )
  );
