import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeSummarizedVisualization from './SummarizedVizualization';
import WordInContextContainer from './drilldowns/WordInContextContainer';
import withAsyncFetch from '../../common/hocs/AsyncContainer';
import withDrillDown from '../../common/hocs/DrillDownContainer';
import { fetchQueryTopWords, fetchDemoQueryTopWords, resetTopWords, selectWord } from '../../../actions/explorerActions';
import { postToDownloadUrl, slugifiedQueryLabel } from '../../../lib/explorerUtil';
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
  handleDownload = (query, ngramSize) => {
    postToDownloadUrl('/api/explorer/words/wordcount.csv', query, { ngramSize });
  }
  handleWordClick = (word) => {
    const { handleSelectedWord, handleDrillDownAction, closeDrillDown, openDrillDown } = this.props;
    const drillDown = (
      <WordInContextContainer
        handleDrillDownAction={() => handleDrillDownAction(word)}
        handleClose={closeDrillDown}
      />
    );
    handleSelectedWord(word);
    openDrillDown(drillDown);
  }
  render() {
    const { results, queries, tabSelector, selectedTabIndex } = this.props;
    const { formatMessage } = this.props.intl;
    const selectedQuery = queries[selectedTabIndex];
    return (
      <EditableWordCloudDataCard
        actionMenuHeaderText={formatMessage(localMessages.menuHeader, { queryName: selectedQuery.label })}
        subHeaderContent={tabSelector}
        words={results[selectedTabIndex].list}
        onViewModeClick={this.handleWordClick}
        border={false}
        domId={WORD_CLOUD_DOM_ID}
        width={585}
        onDownload={ngramSize => this.handleDownload(selectedQuery, ngramSize)}
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
  onQueryModificationRequested: PropTypes.func.isRequired,
  openDrillDown: PropTypes.func.isRequired,
  closeDrillDown: PropTypes.func.isRequired,
  // from composition
  intl: PropTypes.object.isRequired,
  selectedTabIndex: PropTypes.number.isRequired,
  tabSelector: PropTypes.object.isRequired,
  // from dispatch
  fetchData: PropTypes.func.isRequired,
  results: PropTypes.array.isRequired,
  handleDrillDownAction: PropTypes.func.isRequired,
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
  fetchData: (queries) => {
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
        };
        return dispatch(fetchDemoQueryTopWords(demoInfo)); // id
      });
    }
  },
  handleSelectedWord: (word) => {
    dispatch(selectWord(word));
  },
  handleDrillDownAction: (word) => {
    ownProps.onQueryModificationRequested(word.term);
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
      withDrillDown(
        composeSummarizedVisualization(localMessages.title, localMessages.descriptionIntro, messages.wordcloudHelpText)(
          withAsyncFetch(
            composeQueryResultsSelector(
                QueryWordsResultsContainer
              )
            )
          )
        )
    )
  );
