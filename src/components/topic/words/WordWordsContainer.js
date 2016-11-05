import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import composeAsyncContainer from '../../common/AsyncContainer';
import composeHelpfulContainer from '../../common/HelpfulContainer';
import OrderedWordCloud from '../../vis/OrderedWordCloud';
import { fetchWordWords } from '../../../actions/topicActions';
import DataCard from '../../common/DataCard';
import messages from '../../../resources/messages';
import { DownloadButton } from '../../common/IconButton';
import { getBrandDarkColor } from '../../../styles/colors';
import { generateParamStr } from '../../../lib/apiUtil';

const localMessages = {
  helpTitle: { id: 'word.words.help.title', defaultMessage: 'About Word Top Words' },
  helpText: { id: 'word.words.help.into',
    defaultMessage: '<p>This is a visualization showing the top words associated with this word.  Rollover a word to see the stem and how often it was used.</p>',
  },
};

class WordWordsContainer extends React.Component {
  downloadCsv = () => {
    const { word, topicId } = this.props;
    const url = `/api/topics/${topicId}/words/${word}/words.csv`;
    window.location = url;
  }
  render() {
    const { words, helpButton, handleWordCloudClick } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <DataCard>
        <div className="actions">
          <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />
        </div>
        <h2>
          <FormattedMessage {...messages.word} />
          {helpButton}
        </h2>
        <OrderedWordCloud words={words} onWordClick={handleWordCloudClick} textColor={getBrandDarkColor()} showTooltips />
      </DataCard>
    );
  }
}

WordWordsContainer.propTypes = {
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
  helpButton: React.PropTypes.node.isRequired,
  // from parent
  word: React.PropTypes.string.isRequired,
  topicId: React.PropTypes.number.isRequired,
  // from dispatch
  asyncFetch: React.PropTypes.func.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  words: React.PropTypes.array.isRequired,
  handleWordCloudClick: React.PropTypes.func,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.word.words.fetchStatus,
  words: state.topics.selected.word.words.list,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  asyncFetch: () => {
    dispatch(fetchWordWords(ownProps.topicId, ownProps.word)); // fetch the info we need
  },
  handleWordCloudClick: (word) => {
    const params = generateParamStr({ stem: word.stem, term: word.term });
    let url = `/topics/${ownProps.topicId}/words/${word.stem}*?`;
    url += params;
    window.location = url;
    dispatch(push(url));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeHelpfulContainer(localMessages.helpTitle, [localMessages.helpText, messages.wordcloudHelpText])(
        composeAsyncContainer(
          WordWordsContainer
        )
      )
    )
  );

// lightweight wrapper around OrderedWordCloud
