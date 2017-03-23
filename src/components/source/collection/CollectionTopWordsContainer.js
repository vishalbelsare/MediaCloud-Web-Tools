import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { fetchCollectionTopWords } from '../../../actions/sourceActions';
import composeAsyncContainer from '../../common/AsyncContainer';
import EditableWordCloudDataCard from '../../common/EditableWordCloudDataCard';
import composeHelpfulContainer from '../../common/HelpfulContainer';
import messages from '../../../resources/messages';

const localMessages = {
  title: { id: 'collection.summary.topWords.title', defaultMessage: 'Top Words' },
  intro: { id: 'collection.summary.topWords.intro',
    defaultMessage: '<p>This wordcloud shows you the most commonly used words in this collection (based on a sample of sentences). Click a word to load a Dashboard search showing you how sources in this colleciton write about it.</p>' },
  helpTitle: { id: 'collection.summary.topWords.help.title', defaultMessage: 'About Top Words' },
};

class CollectionTopWordsContainer extends React.Component {
  handleWordClick = (word) => {
    const { collectionId } = this.props;
    const searchStr = `${word.stem}*`;
    const url = `https://dashboard.mediacloud.org/#query/["${searchStr}"]/[{"sets":[${collectionId}]}]/[]/[]/[{"uid":1,"name":"${searchStr}","color":"55868A"}]`;
    window.open(url, '_blank');
  }
  render() {
    const { collectionId, words, helpButton } = this.props;
    const { formatMessage } = this.props.intl;
    const downloadUrl = `/api/collections/${collectionId}/words/wordcount.csv`;
    return (
      <EditableWordCloudDataCard
        words={words}
        downloadUrl={downloadUrl}
        onViewModeClick={this.handleWordClick}
        title={formatMessage(localMessages.title)}
        domId={`"collection-top-words-${collectionId}`}
        width={520}
        helpButton={helpButton}
      />
    );
  }
}

CollectionTopWordsContainer.propTypes = {
  // from parent
  collectionId: React.PropTypes.number.isRequired,
  // from dispath
  asyncFetch: React.PropTypes.func.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  words: React.PropTypes.array,
  // from composition
  intl: React.PropTypes.object.isRequired,
  helpButton: React.PropTypes.node.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.sources.collections.selected.collectionTopWords.fetchStatus,
  words: state.sources.collections.selected.collectionTopWords.list.wordcounts,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  asyncFetch: () => {
    dispatch(fetchCollectionTopWords(ownProps.collectionId));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeHelpfulContainer(localMessages.helpTitle, [localMessages.intro, messages.wordcloudHelpText])(
        composeAsyncContainer(
          CollectionTopWordsContainer
        )
      )
    )
  );
