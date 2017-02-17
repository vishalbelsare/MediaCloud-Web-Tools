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
import ActionMenu from '../../common/ActionMenu';
import { generateParamStr } from '../../../lib/apiUtil';
import { downloadSvg } from '../../util/svg';

const localMessages = {
  helpTitle: { id: 'word.words.help.title', defaultMessage: 'About Word Top Words' },
  helpText: { id: 'word.words.help.into',
    defaultMessage: '<p>This is a visualization showing the top words associated with this word.  Click a word to jump to a page about how it is used.</p>',
  },
};

const WORD_CLOUD_DOM_ID = 'word-cloud';

class WordWordsContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { fetchData, filters } = this.props;
    if (nextProps.filters.timespanId !== filters.timespanId || (nextProps.stem !== this.props.stem || nextProps.term !== this.props.term)) {
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
    const menuItems = [
      { text: formatMessage(messages.downloadCSV), clickHandler: this.downloadCsv },
      { text: formatMessage(messages.downloadSVG), clickHandler: () => downloadSvg(WORD_CLOUD_DOM_ID) },
    ];
    return (
      <DataCard>
        <div className="actions">
          <ActionMenu actionItems={menuItems} useBackgroundColor />
        </div>
        <h2>
          <FormattedMessage {...messages.topWords} />
          {helpButton}
        </h2>
        <OrderedWordCloud
          words={words} onWordClick={handleWordCloudClick} domId={WORD_CLOUD_DOM_ID}
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
  filters: state.topics.selected.filters,
  words: state.topics.selected.word.words.list,
  stem: state.topics.selected.word.info.stem,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (props) => {
    dispatch(fetchWordWords(ownProps.topicId, props.stem));
  },
  pushToUrl: url => dispatch(push(url)),
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(stateProps);
    },
    handleWordCloudClick: (word) => {
      const params = generateParamStr({ ...stateProps.filters, stem: word.stem, term: word.term });
      const url = `/topics/${ownProps.topicId}/words/${word.term}*?${params}`;
      dispatchProps.pushToUrl(url);
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
