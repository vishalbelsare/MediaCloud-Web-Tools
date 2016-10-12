import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import OrderedWordCloud from '../../vis/OrderedWordCloud';
import { fetchSourceCollectionTopWords } from '../../../actions/sourceActions';
import composeAsyncContainer from '../../common/AsyncContainer';
import DataCard from '../../common/DataCard';

import messages from '../../../resources/messages';
import composeHelpfulContainer from '../../common/HelpfulContainer';
import { DownloadButton } from '../../common/IconButton';

const localMessages = {
  title: { id: 'collection.summary.topWords.title', defaultMessage: 'Top Words' },
  helpTitle: { id: 'topic.summary.topWords.help.title', defaultMessage: 'About Top Words' },
  helpText: { id: 'topic.summary.topWords.help.text',
    defaultMessage: '<p>This chart shows you the coverage of this Collection in top words.</p>',
  },
};

class CollectionTopWordsContainer extends React.Component {

  downloadCsv = () => {
    const { collectionId } = this.props;
    const url = `/api/sources/${collectionId}/wordcounts/count.csv`;
    window.location = url;
  }

  render() {
    const { intro, words, onWordClick, intl } = this.props;
    const { formatMessage } = intl;
    return (
      <DataCard>
        <h2><FormattedMessage {...localMessages.title} /></h2>
        <p>{ intro }</p>
        <div className="actions">
          <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />
        </div>
        <OrderedWordCloud words={words} onWordClick={onWordClick} />
      </DataCard>
    );
  }
}

CollectionTopWordsContainer.propTypes = {
  // from parent
  collectionId: React.PropTypes.number.isRequired,
  intro: React.PropTypes.string.isRequired,
  onWordClick: React.PropTypes.func,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  words: React.PropTypes.array,
  asyncFetch: React.PropTypes.func.isRequired,
  // from composition
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.sources.selected.details.collectionDetailsReducer.collectionTopWords.fetchStatus,
  words: state.sources.selected.details.collectionDetailsReducer.collectionTopWords.list.wordcounts,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  asyncFetch: () => {
    dispatch(fetchSourceCollectionTopWords(ownProps.collectionId));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeHelpfulContainer(localMessages.helpTitle, [localMessages.helpText])(
        composeAsyncContainer(
          CollectionTopWordsContainer
        )
      )
    )
  );
