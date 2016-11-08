import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import OrderedWordCloud from '../../vis/OrderedWordCloud';
import { fetchCollectionTopWords } from '../../../actions/sourceActions';
import composeAsyncContainer from '../../common/AsyncContainer';
import DataCard from '../../common/DataCard';
import messages from '../../../resources/messages';
import composeHelpfulContainer from '../../common/HelpfulContainer';
import { DownloadButton } from '../../common/IconButton';

const localMessages = {
  title: { id: 'collection.summary.topWords.title', defaultMessage: 'Top Words' },
  intro: { id: 'collection.summary.topWords.intro',
    defaultMessage: 'This wordcloud shows you the most commonly used words in this collection (based on a sample of sentences). Click a word to load a Dashboard search showing you how sources in this colleciton write about it.' },
  helpTitle: { id: 'collection.summary.topWords.help.title', defaultMessage: 'About Top Words' },
  helpText: { id: 'collection.summary.topWords.help.text',
    defaultMessage: '<p>This visualization shows you the words used most often in this collection.</p>',
  },
};

class CollectionTopWordsContainer extends React.Component {

  downloadCsv = () => {
    const { collectionId } = this.props;
    const url = `/api/collections/${collectionId}/words/wordcount.csv`;
    window.location = url;
  }

  render() {
    const { words, onWordClick, helpButton } = this.props;
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
        <p><FormattedMessage {...localMessages.intro} /></p>
        <OrderedWordCloud words={words} onWordClick={onWordClick} />
      </DataCard>
    );
  }
}

CollectionTopWordsContainer.propTypes = {
  // from parent
  collectionId: React.PropTypes.number.isRequired,
  onWordClick: React.PropTypes.func,
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
  fetchStatus: state.sources.selected.details.collectionDetailsReducer.collectionTopWords.fetchStatus,
  words: state.sources.selected.details.collectionDetailsReducer.collectionTopWords.list.wordcounts,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  asyncFetch: () => {
    dispatch(fetchCollectionTopWords(ownProps.collectionId));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeHelpfulContainer(localMessages.helpTitle, [localMessages.helpText, messages.wordcloudHelpText])(
        composeAsyncContainer(
          CollectionTopWordsContainer
        )
      )
    )
  );
