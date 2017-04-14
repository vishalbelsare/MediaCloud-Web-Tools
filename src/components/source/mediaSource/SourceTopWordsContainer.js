import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { fetchSourceTopWords } from '../../../actions/sourceActions';
import composeAsyncContainer from '../../common/AsyncContainer';
import composeHelpfulContainer from '../../common/HelpfulContainer';
import messages from '../../../resources/messages';
import { PAST_ALL } from '../../../lib/dateUtil';
import PeriodicEditableWordCloudDataCard from '../../common/PeriodicEditableWordCloudDataCard';

const localMessages = {
  title: { id: 'source.summary.topWords.title', defaultMessage: 'Top Words' },
  intro: { id: 'source.summary.topWords.info',
    defaultMessage: '<p>This wordcloud shows you the most commonly used words in this source (based on a sample of sentences). Click a word to load a Dashboard search showing you how the this source writes about it.</p>' },
  helpTitle: { id: 'source.summary.sentenceCount.help.title', defaultMessage: 'About Top Words' },
};

class SourceTopWordsContainer extends React.Component {
  fetchWordsByTimePeriod = (dateQuery, timePeriod) => {
    const { fetchData, source } = this.props;
    fetchData(source.media_id, timePeriod, dateQuery);
  }
  handleWordClick = (word) => {
    const { source } = this.props;
    const searchStr = `${word.stem}*`;
    const url = `https://dashboard.mediacloud.org/#query/["${searchStr}"]/[{"sources":[${source.media_id}]}]/["${source.health.start_date.substring(0, 10)}"]/["${source.health.end_date.substring(0, 10)}"]/[{"uid":3,"name":"${source.name}","color":"55868A"}]`;
    window.open(url, '_blank');
  }
  render() {
    const { source, words, helpButton, timePeriod } = this.props;
    const { formatMessage } = this.props.intl;
    const downloadUrl = `/api/sources/${source.media_id}/words/wordcount.csv`;
    return (
      <PeriodicEditableWordCloudDataCard
        words={words}
        handleTimePeriodClick={this.fetchWordsByTimePeriod}
        selectedTime={timePeriod}
        downloadUrl={downloadUrl}
        targetURL={`/sources/${source.media_id}`}
        onViewModeClick={this.handleWordClick}
        title={formatMessage(localMessages.title)}
        domId={`media-source-top-words-${source.media_id}`}
        width={520}
        helpButton={helpButton}
      />
    );
  }
}

SourceTopWordsContainer.propTypes = {
  // from parent
  source: React.PropTypes.object.isRequired,
  // from state
  fetchData: React.PropTypes.func.isRequired,
  fetchStatus: React.PropTypes.string.isRequired,
  words: React.PropTypes.array,
  timePeriod: React.PropTypes.string.isRequired,
  // from dispatch
  asyncFetch: React.PropTypes.func.isRequired,
  // from composition
  intl: React.PropTypes.object.isRequired,
  helpButton: React.PropTypes.node.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.sources.sources.selected.topWords.fetchStatus,
  words: state.sources.sources.selected.topWords.list.wordcounts,
  timePeriod: state.sources.sources.selected.topWords.timePeriod,
});

const mapDispatchToProps = dispatch => ({
  fetchData: (mediaId, timePeriod, dateQuery) => {
    dispatch(fetchSourceTopWords(mediaId, { timePeriod, q: dateQuery }));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(ownProps.source.media_id, PAST_ALL);
    },
  });
}


export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      composeHelpfulContainer(localMessages.helpTitle, [localMessages.intro, messages.wordcloudHelpText])(
        composeAsyncContainer(
          SourceTopWordsContainer
        )
      )
    )
  );
