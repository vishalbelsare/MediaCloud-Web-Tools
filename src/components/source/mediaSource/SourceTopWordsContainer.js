import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import OrderedWordCloud from '../../vis/OrderedWordCloud';
import { fetchSourceTopWords } from '../../../actions/sourceActions';
import composeAsyncContainer from '../../common/AsyncContainer';
import DataCard from '../../common/DataCard';

const localMessages = {
  title: { id: 'source.summary.topWords.title', defaultMessage: 'Top Words' },
};

const SourceTopWordsContainer = (props) => {
  const { intro, words, onWordClick } = props;
  return (
    <DataCard>
      <h2><FormattedMessage {...localMessages.title} /></h2>
      <p>{ intro }</p>
      <OrderedWordCloud words={words} onWordClick={onWordClick} />
    </DataCard>
  );
};

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
      composeAsyncContainer(
        SourceTopWordsContainer
      )
    )
  );
