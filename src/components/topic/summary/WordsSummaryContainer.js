import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import withSampleSize from '../../common/composers/SampleSize';
import withCsvDownloadNotifyContainer from '../../common/hocs/CsvDownloadNotifyContainer';
import { filteredLinkTo, filtersAsUrlParams } from '../../util/location';
import withAsyncFetch from '../../common/hocs/AsyncContainer';
import withDescription from '../../common/hocs/DescribedDataCard';
import EditableWordCloudDataCard from '../../common/EditableWordCloudDataCard';
import { fetchTopicTopWords } from '../../../actions/topicActions';
import messages from '../../../resources/messages';
import { generateParamStr } from '../../../lib/apiUtil';
import { topicDownloadFilename } from '../../util/topicUtil';

const WORD_CLOUD_DOM_ID = 'topic-summary-media-word-cloud';

const localMessages = {
  descriptionIntro: { id: 'topic.summary.words.help.into',
    defaultMessage: 'Look at the top words to see how this topic was talked about. This can suggest what the dominant narrative was, and looking at different timespans can suggest how it evolved over time.',
  },
};

class WordsSummaryContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { filters, fetchData } = this.props;
    if (nextProps.filters !== filters) {
      fetchData(nextProps);
    }
  }
  render() {
    const { topicInfo, initSampleSize, onViewSampleSizeClick, filters, handleWordCloudClick } = this.props;
    const urlDownload = `/api/topics/${topicInfo.topics_id}/words.csv?${filtersAsUrlParams(filters)}`;
    const { formatMessage } = this.props.intl;
    return (
      <EditableWordCloudDataCard
        words={this.props.words}
        explore={filteredLinkTo(`/topics/${topicInfo.topics_id}/words`, filters)}
        initSampleSize={initSampleSize}
        downloadUrl={urlDownload}
        onViewModeClick={handleWordCloudClick}
        onViewSampleSizeClick={onViewSampleSizeClick}
        title={formatMessage(messages.topWords)}
        domId={WORD_CLOUD_DOM_ID}
        svgDownloadPrefix={`${topicDownloadFilename(topicInfo.name, filters)}-words`}
        includeTopicWord2Vec
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
  topicInfo: PropTypes.object,
  words: PropTypes.array,
  fetchStatus: PropTypes.string.isRequired,
  handleWordCloudClick: PropTypes.func,
  onViewSampleSizeClick: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.summary.topWords.fetchStatus,
  topicInfo: state.topics.selected.info,
  words: state.topics.selected.summary.topWords.list,
  filters: state.topics.selected.filters,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (sampleSize) => {
    dispatch(fetchTopicTopWords(ownProps.topicId, { ...ownProps.filters, sample_size: sampleSize.sample_size }));
  },
  asyncFetch: () => {
    dispatch(fetchTopicTopWords(ownProps.topicId, ownProps.filters));
  },
  pushToUrl: url => dispatch(push(url)),
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    handleWordCloudClick: (word) => {
      // imoprtant to pick term with the OR clause for other languages that we don't stem well
      const params = generateParamStr({ ...stateProps.filters, stem: word.stem, term: word.term || word.stem });
      const url = `/topics/${ownProps.topicId}/words/${word.stem}*?${params}`;
      dispatchProps.pushToUrl(url);
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      withSampleSize(
        withDescription(localMessages.descriptionIntro,
          [messages.wordcloudHelpText, messages.wordCloudTopicWord2VecLayoutHelp])(
          withAsyncFetch(
            withCsvDownloadNotifyContainer(
              WordsSummaryContainer
            )
          )
        )
      )
    )
  );
