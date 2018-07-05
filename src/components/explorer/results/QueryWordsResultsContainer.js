import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeSummarizedVisualization from './SummarizedVizualization';
import withAsyncFetch from '../../common/hocs/AsyncContainer';
import { fetchQueryTopWords, fetchDemoQueryTopWords, resetTopWords, selectWord }
from '../../../actions/explorerActions';
import { postToDownloadUrl, slugifiedQueryLabel, queryChangedEnoughToUpdate } from '../../../lib/explorerUtil';
import messages from '../../../resources/messages';
import composeQueryResultsSelector from './QueryResultsSelector';
import EditableWordCloudDataCard from '../../common/EditableWordCloudDataCard';

const localMessages = {
  title: { id: 'explorer.topWords.title', defaultMessage: 'Top Words' },
  descriptionIntro: { id: 'explorer.topWords.help.title', defaultMessage: '<p>Here are the top words used with each query. Looking at the language used can help you identify how this issue is talked about in the media online.</p>' },
  menuHeader: { id: 'explorer.topWords.menuHeader', defaultMessage: 'Query: {queryName}' },
};

const WORD_CLOUD_DOM_ID = 'query-word-cloud-wrapper';

class QueryWordsResultsContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { lastSearchTime, fetchData } = this.props;
    if (nextProps.lastSearchTime !== lastSearchTime) {
      fetchData(nextProps.queries);
    }
  }
  shouldComponentUpdate(nextProps) {
    const { results, queries } = this.props;
    return queryChangedEnoughToUpdate(queries, nextProps.queries, results, nextProps.results);
  }
  handleDownload = (query, ngramSize, sampleSize) => {
    postToDownloadUrl('/api/explorer/words/wordcount.csv', query, { ngramSize, sample_size: sampleSize });
  }
  handleWordClick = (wordDataPoint) => {
    const { handleSelectedWord, selectedQuery } = this.props;
    handleSelectedWord(selectedQuery, wordDataPoint.term);
  }
  render() {
    const { results, queries, tabSelector, selectedQueryIndex, fetchData } = this.props;
    const { formatMessage } = this.props.intl;
    const selectedQuery = queries[selectedQueryIndex];
    return (
      <EditableWordCloudDataCard
        actionMenuHeaderText={formatMessage(localMessages.menuHeader, { queryName: selectedQuery.label })}
        onViewSampleSizeClick={sampleSize => fetchData(queries, sampleSize)}
        initSampleSize={results[selectedQueryIndex].sample_size}
        subHeaderContent={tabSelector}
        words={results[selectedQueryIndex].list}
        onViewModeClick={this.handleWordClick}
        border={false}
        domId={WORD_CLOUD_DOM_ID}
        width={585}
        onDownload={ngramSize => this.handleDownload(selectedQuery, ngramSize, results[selectedQueryIndex].sample_size)}
        svgDownloadPrefix={`${slugifiedQueryLabel(selectedQuery.label)}-ngram-1`}
        textColor={selectedQuery.color}
        actionsAsLinksUnderneath
        hideGoogleWord2Vec
      />
    );
  }
}

QueryWordsResultsContainer.propTypes = {
  // from parent
  lastSearchTime: PropTypes.number.isRequired,
  queries: PropTypes.array.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  // from composition
  intl: PropTypes.object.isRequired,
  selectedQueryIndex: PropTypes.number.isRequired,
  selectedQuery: PropTypes.object.isRequired,
  tabSelector: PropTypes.object.isRequired,
  // from dispatch
  fetchData: PropTypes.func.isRequired,
  results: PropTypes.array.isRequired,
  handleSelectedWord: PropTypes.func.isRequired,
  selectedWord: PropTypes.object,
  // from mergeProps
  asyncFetch: PropTypes.func.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.explorer.topWords.fetchStatus,
  results: state.explorer.topWords.results,
  selectedWord: state.explorer.topWords.selectedWord,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (queries, sampleSize) => {
    // this should trigger when the user clicks the Search button or changes the URL
    // for n queries, run the dispatch with each parsed query
    dispatch(resetTopWords());
    if (ownProps.isLoggedIn) {
      const runTheseQueries = queries || ownProps.queries;
      runTheseQueries.map((q) => {
        const infoToQuery = {
          start_date: q.startDate,
          end_date: q.endDate,
          q: q.q,
          index: q.index,
          sources: q.sources.map(s => s.id),
          collections: q.collections.map(c => c.id),
          sample_size: sampleSize,
        };
        return dispatch(fetchQueryTopWords(infoToQuery));
      });
    } else if (queries || ownProps.queries) { // else assume DEMO mode, but assume the queries have been loaded
      const runTheseQueries = queries || ownProps.queries;
      runTheseQueries.map((q, index) => {
        const demoInfo = {
          index, // should be same as q.index btw
          search_id: q.searchId, // may or may not have these
          query_id: q.id,
          q: q.q, // only if no query id, means demo user added a keyword
          sample_size: sampleSize,
        };
        return dispatch(fetchDemoQueryTopWords(demoInfo)); // id
      });
    }
  },
  handleSelectedWord: (selectedQuery, word) => {
    // add the word they clicked to the query and save that for drilling down into
    const clickedQuery = {
      q: `${selectedQuery.q} AND ${word}`,
      start_date: selectedQuery.startDate,
      end_date: selectedQuery.endDate,
      sources: selectedQuery.sources.map(s => s.id),
      collections: selectedQuery.collections.map(c => c.id),
      word,
      rows: 1000, // need a big sample size here for good results
    };
    // dispatch(resetSelectedWord());
    dispatch(selectWord(clickedQuery));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(ownProps.queries);
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      composeSummarizedVisualization(localMessages.title, localMessages.descriptionIntro, messages.wordcloudHelpText)(
        withAsyncFetch(
          composeQueryResultsSelector(
            QueryWordsResultsContainer
          )
        )
      )
    )
  );
