import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import composeAsyncContainer from '../../common/AsyncContainer';
import composeHelpfulContainer from '../../common/HelpfulContainer';
import { fetchWordWords } from '../../../actions/topicActions';
import EditableWordCloudDataCard from '../../common/EditableWordCloudDataCard';
import messages from '../../../resources/messages';
import { generateParamStr } from '../../../lib/apiUtil';
import { filteredLinkTo, filtersAsUrlParams } from '../../util/location';

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
      fetchData(nextProps.stem, nextProps.filters);
    }
  }

  render() {
    const { topicId, filters, words, term, handleWordCloudClick, helpButton } = this.props;
    const { formatMessage } = this.props.intl;
    const urlDownload = `/api/topics/${topicId}/words/${term}/words.csv?${filtersAsUrlParams(filters)}`;
    return (
      <EditableWordCloudDataCard
        words={words}
        explore={filteredLinkTo(`/topics/${topicId}/words`, filters)}
        downloadUrl={urlDownload}
        onViewModeClick={handleWordCloudClick}
        title={formatMessage(messages.topWords)}
        helpButton={helpButton}
        domId={WORD_CLOUD_DOM_ID}
      />
    );
  }
}

WordWordsContainer.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  helpButton: PropTypes.node.isRequired,
  // from parent
  topicId: PropTypes.number.isRequired,
  filters: PropTypes.object.isRequired,
  term: PropTypes.string.isRequired,
  stem: PropTypes.string.isRequired,
  // from dispatch
  fetchData: PropTypes.func.isRequired,
  asyncFetch: PropTypes.func.isRequired,
  handleWordCloudClick: PropTypes.func,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  words: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.word.words.fetchStatus,
  words: state.topics.selected.word.words.list,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  asyncFetch: () => {
    dispatch(fetchWordWords(ownProps.topicId, ownProps.stem, ownProps.filters));
  },
  fetchData: (stem, filters) => {
    dispatch(fetchWordWords(ownProps.topicId, stem, filters));
  },
  handleWordCloudClick: (word) => {
    const params = generateParamStr({ ...ownProps.filters, stem: word.stem, term: word.term });
    const url = `/topics/${ownProps.topicId}/words/${word.term}*?${params}`;
    dispatch(push(url));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeHelpfulContainer(localMessages.helpTitle, [localMessages.helpText, messages.wordcloudHelpText, messages.wordCloudWord2VecLayoutHelp])(
        composeAsyncContainer(
          WordWordsContainer
        )
      )
    )
  );

// lightweight wrapper around OrderedWordCloud
