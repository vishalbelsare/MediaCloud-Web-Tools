import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import OrderedWordCloud from '../../vis/OrderedWordCloud';
import { fetchSourceTopWords } from '../../../actions/sourceActions';
import composeAsyncContainer from '../../common/AsyncContainer';
import DataCard from '../../common/DataCard';
import messages from '../../../resources/messages';
import composeHelpfulContainer from '../../common/HelpfulContainer';
import { DownloadButton } from '../../common/IconButton';

const localMessages = {
  title: { id: 'source.summary.topWords.title', defaultMessage: 'Top Words' },
  helpTitle: { id: 'topic.summary.sentenceCount.help.title', defaultMessage: 'About Top Words' },
  helpText: { id: 'topic.summary.sentenceCount.help.text',
    defaultMessage: '<p>This chart shows you the coverage of this Source in words.</p>',
  },
};

class SourceTopWordsContainer extends React.Component {
  render() {
    const { intro, words, onWordClick } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <DataCard>
        <div className="actions">
          <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />
        </div>
        <h2><FormattedMessage {...localMessages.title} /></h2>
        <p>{ intro }</p>
        <OrderedWordCloud words={words} onWordClick={onWordClick} />
      </DataCard>
    );
  }
}

SourceTopWordsContainer.propTypes = {
  // from parent
  sourceId: React.PropTypes.string.isRequired,
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
  fetchStatus: state.sources.selected.details.sourceDetailsReducer.topWords.fetchStatus,
  words: state.sources.selected.details.sourceDetailsReducer.topWords.list.wordcounts,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  asyncFetch: () => {
    dispatch(fetchSourceTopWords(ownProps.sourceId));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeHelpfulContainer(localMessages.helpTitle, localMessages.helpText)(
        composeAsyncContainer(
          SourceTopWordsContainer
        )
      )
    )
  );
