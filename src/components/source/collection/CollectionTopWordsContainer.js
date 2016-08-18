import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import OrderedWordCloud from '../../vis/OrderedWordCloud';
import { fetchSourceCollectionTopWords } from '../../../actions/sourceActions';
import composeAsyncContainer from '../../common/AsyncContainer';
import DataCard from '../../common/DataCard';

const localMessages = {
  title: { id: 'collection.summary.topWords.title', defaultMessage: 'Top Words' },
};

const CollectionTopWordsContainer = (props) => {
  const { intro, words, onWordClick } = props;
  return (
    <DataCard>
      <h2><FormattedMessage {...localMessages.title} /></h2>
      <p>{ intro }</p>
      <OrderedWordCloud words={words} onWordClick={onWordClick} />
    </DataCard>
  );
};

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

const mapStateToProps = (state) => ({
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
      composeAsyncContainer(
        CollectionTopWordsContainer
      )
    )
  );
