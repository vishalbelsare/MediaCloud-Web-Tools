import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import withAsyncFetch from '../../common/hocs/AsyncContainer';
import DataCard from '../../common/DataCard';
import WordSpace from '../../vis/WordSpace';
import withDescription from '../../common/hocs/DescribedDataCard';
import messages from '../../../resources/messages';
import { DownloadButton } from '../../common/IconButton';
import { topicDownloadFilename } from '../../util/topicUtil';
import { downloadSvg } from '../../util/svg';

const localMessages = {
  title: { id: 'topic.summary.words.space.title', defaultMessage: 'Topic Word Space' },
  descriptionIntro: { id: 'topic.summary.words.help.into',
    defaultMessage: '<p>The "word space" shows you how words are used within the stories that are part of this topic. It can give you a sense of the differing sub-conversations that exist in the entire corpus. Words used more appear bigger and darker, like a standard word cloud.  Rollover a word to highlight other words that are used in similar contexts.  Words that are closer together within the cone that appears have a high probability of showing up in similar contexts (though not necessarily together). Words that are further apart have a low probability of showing up in the same context. <A href="https://mediacloud.org/news/2018/5/23/word-spaces-visualizing-word2vec-to-support-media-analysis">Read our recent blog post to learn more.</a></p>',
  },
  noTopicW2VData: { id: 'topic.summary.wordspace.nodata', defaultMessage: 'Sorry, the topic model does not exist.' },
};
const WORD_SPACE_DOM_ID = 'topic-summary-word-space';

class TopicWordSpaceContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { filters, fetchData } = this.props;
    if (nextProps.filters !== filters) {
      fetchData(nextProps);
    }
  }

  render() {
    const { words, topicName, filters } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <DataCard>
        <div className="actions">
          <DownloadButton
            tooltip={formatMessage(messages.download)}
            onClick={() => downloadSvg(`${topicDownloadFilename(topicName, filters)}-sampled-word-space`, WORD_SPACE_DOM_ID)}
          />
        </div>
        <h2><FormattedMessage {...localMessages.title} /></h2>
        <WordSpace
          words={words.slice(0, 50)}
          domId={WORD_SPACE_DOM_ID}
          xProperty="w2v_x"
          yProperty="w2v_y"
          noDataMsg={localMessages.noTopicW2VData}
        />
      </DataCard>
    );
  }
}

TopicWordSpaceContainer.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  // from parent
  topicId: PropTypes.number.isRequired,
  // from dispatch
  asyncFetch: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  // from state
  words: PropTypes.array,
  fetchStatus: PropTypes.string.isRequired,
  filters: PropTypes.object.isRequired,
  topicName: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.summary.topWords.fetchStatus,
  words: state.topics.selected.summary.topWords.list,
  filters: state.topics.selected.filters,
  topicName: state.topics.selected.info.name,
});

const mapDispatchToProps = dispatch => ({
  // don't need to do anything, because the WordsSummaryContainer is making the request for the same data already
  fetchData: () => {
  },
  asyncFetch: () => {
  },
  pushToUrl: url => dispatch(push(url)),
});

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    withDescription(localMessages.descriptionIntro, [messages.wordCloudTopicWord2VecLayoutHelp])(
      withAsyncFetch(
        TopicWordSpaceContainer
      )
    )
  )
);
