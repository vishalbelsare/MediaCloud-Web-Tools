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
import { generateParamStr } from '../../../lib/apiUtil';

const localMessages = {
  helpTitle: { id: 'word.words.help.title', defaultMessage: 'About Word Top Words' },
  helpText: { id: 'word.words.help.into',
    defaultMessage: '<p>This is a visualization showing the top words associated with this word.  Click a word to jump to a page about how it is used.</p>',
  },
};

class WordWordsContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { fetchData } = this.props;
    if (nextProps.term !== this.props.term) {
      fetchData(nextProps);
    }
  }
  downloadCsv = () => {
    const { term, topicId } = this.props;
    const url = `/api/topics/${topicId}/words/${term}/words.csv`;
    window.location = url;
  }

  render() {
    const { words, handleWordCloudClick, helpButton } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <DataCard>
        <div className="actions">
          <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />
        </div>
        <h2>
          <FormattedMessage {...messages.topWords} />
          {helpButton}
        </h2>
        <OrderedWordCloud
          words={words} onWordClick={handleWordCloudClick}
        />
      </DataCard>
    );
  }
}

WordWordsContainer.propTypes = {
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
  helpButton: React.PropTypes.node.isRequired,
  // from parent
  topicId: React.PropTypes.number.isRequired,
  filters: React.PropTypes.object.isRequired,
  // from dispatch
  fetchData: React.PropTypes.func.isRequired,
  asyncFetch: React.PropTypes.func.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  words: React.PropTypes.array.isRequired,
  handleWordCloudClick: React.PropTypes.func,
  term: React.PropTypes.string.isRequired,
  stem: React.PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.word.words.fetchStatus,
  words: state.topics.selected.word.words.list,
  stem: state.topics.selected.word.info.stem,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (props) => {
    dispatch(fetchWordWords(ownProps.topicId, props.stem));
  },
  handleWordCloudClick: (word) => {
    const params = generateParamStr({ stem: word.stem, term: word.term });
    let url = `/topics/${ownProps.topicId}/words/${word.term}*?`;
    url += params;
    dispatch(push(url));
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
      composeHelpfulContainer(localMessages.helpTitle, [localMessages.helpText, messages.wordcloudHelpText])(
        composeAsyncContainer(
          WordWordsContainer
        )
      )
    )
  );

// lightweight wrapper around OrderedWordCloud
