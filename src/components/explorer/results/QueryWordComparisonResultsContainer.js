import PropTypes from 'prop-types';
import React from 'react';
import { FormattedHTMLMessage, FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import composeAsyncContainer from '../../common/AsyncContainer';
import { fetchQueryTopWordsComparison, fetchDemoQueryTopWordsComparison, selectComparativeWordField, resetTopWordsComparison, updateQuery } from '../../../actions/explorerActions';
import { queryChangedEnoughToUpdate } from '../../../lib/explorerUtil';
import { getBrandDarkColor } from '../../../styles/colors';
import ComparativeOrderedWordCloud from '../../vis/ComparativeOrderedWordCloud';
import OrderedWordCloud from '../../vis/OrderedWordCloud';
import WordSelectWrapper from './WordSelectWrapper';

const localMessages = {
  title: { id: 'explorer.comparativeWords.title', defaultMessage: 'Compare Top Words' },
  intro: { id: 'explorer.comparativeWords.intro', defaultMessage: ' These words are the most used in each query. They are sized according to total count across all words in ...' },
  centerTitle: { id: 'explorer.comparativeWords.center', defaultMessage: 'Word used in both' },
  sideTitle: { id: 'explorer.comparativeWords.right', defaultMessage: 'Words unique to {name}' },

};
const LEFT = 0;
const RIGHT = 1;

class QueryWordComparisonResultsContainer extends React.Component {
  componentWillMount() {
    const { queries, selectComparativeWords, leftQuery } = this.props;
    const leftQ = queries[0];
    const rightQ = queries.length > 1 ? queries[1] : queries[0];
    if (leftQuery === null) {
      selectComparativeWords(leftQ, LEFT); // default selection. we can't do this if the user has set the UI widget
      selectComparativeWords(rightQ, RIGHT);
    }
  }
  componentWillReceiveProps(nextProps) {
    const { lastSearchTime, fetchData, selectComparativeWords, leftQuery, rightQuery } = this.props;
    let leftQ = null;
    let rightQ = null;
    if (nextProps.lastSearchTime !== lastSearchTime) {
      // if a search query change from the top
      leftQ = nextProps.queries[0];
      rightQ = nextProps.queries.length > 1 ? nextProps.queries[1] : nextProps.queries[0];
      selectComparativeWords(leftQ, LEFT);
      selectComparativeWords(rightQ, RIGHT);
      fetchData([leftQ, rightQ]);
    } else if (nextProps.leftQuery !== leftQuery ||
      nextProps.rightQuery !== rightQuery) {
      // if a change in the comparison UI selection
      leftQ = nextProps.leftQuery;
      rightQ = nextProps.rightQuery;
      selectComparativeWords(leftQ, LEFT);
      selectComparativeWords(rightQ, RIGHT);
      fetchData([leftQ, rightQ]);
    }
  }
  shouldComponentUpdate(nextProps) {
    const { results, queries, leftQuery, rightQuery } = this.props;
    const shouldChange = queryChangedEnoughToUpdate(queries, nextProps.queries, results, nextProps.results);
    // also check if they changed their view choices
    return (shouldChange || (nextProps.leftQuery !== leftQuery || nextProps.rightQuery !== rightQuery)
    );
  }

  selectAndFetchComparedQueries = (queryObj, target) => {
    const { fetchData, leftQuery, rightQuery, selectComparativeWords } = this.props;
    selectComparativeWords(queryObj, target);
    if (target === LEFT) {
      fetchData([queryObj, rightQuery]);
    } else {
      fetchData([leftQuery, queryObj]);
    }
  }

  downloadCsv = (query) => {
    let url = null;
    if (parseInt(query.searchId, 10) >= 0) {
      url = `/api/explorer/sentences/count.csv/${query.searchId}/${query.index}`;
    } else {
      url = `/api/explorer/sentences/count.csv/[{"q":"${query.q}"}]/${query.index}`;
    }
    window.location = url;
  }

  render() {
    const { queries, results, handleWordCloudClick, leftQuery, rightQuery } = this.props;
    // test the results before we pass to cowc, are there two valid sets of arrays
    // const mergedResultsWithQueryInfo = results.map((r, idx) => Object.assign({}, r, queries[idx]));
    if (results && (queries.length === 1)) {
      return (
        <Grid>
          <Row>
            <Col lg={8}>
              <h2><FormattedMessage {...localMessages.title} /></h2>
              <OrderedWordCloud
                words={results[0]}
                // alreadyNormalized
                width={700}
              />
            </Col>
          </Row>
        </Grid>
      );
    } else if (results && results.length > 0 && leftQuery !== null) {
      let wordSelectorContent;
      if (queries.length > 2) {
        // only show selector if more than two queries
        wordSelectorContent = (
          <WordSelectWrapper
            queries={queries}
            selectComparativeWords={this.selectAndFetchComparedQueries}
            leftQuery={leftQuery}
            rightQuery={rightQuery}
          />
        );
      }
      return (
        <Grid>
          <Row>
            <Col lg={12}>
              <h2><FormattedMessage {...localMessages.title} /></h2>
              {wordSelectorContent}
              <ComparativeOrderedWordCloud
                leftWords={results[0]}
                rightWords={results[1]}
                leftTextColor={leftQuery.color}
                rightTextColor={rightQuery.color}
                textColor={getBrandDarkColor()}
                onWordClick={handleWordCloudClick}
                leftTitleMsg={<FormattedHTMLMessage {...localMessages.sideTitle} values={{ name: leftQuery.label }} />}
                centerTitleMsg={<FormattedHTMLMessage {...localMessages.centerTitle} />}
                rightTitleMsg={<FormattedHTMLMessage {...localMessages.sideTitle} values={{ name: rightQuery.label }} />}
              />
            </Col>
          </Row>
        </Grid>
      );
    }
    return <div>Error</div>;
  }

}

QueryWordComparisonResultsContainer.propTypes = {
  // from parent
  lastSearchTime: PropTypes.number.isRequired,
  queries: PropTypes.array.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  onQueryModificationRequested: PropTypes.func.isRequired,
  // from composition
  intl: PropTypes.object.isRequired,
  // from dispatch
  fetchData: PropTypes.func.isRequired,
  results: PropTypes.array.isRequired,
  // from mergeProps
  asyncFetch: PropTypes.func.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  handleWordCloudClick: PropTypes.func.isRequired,
  selectComparativeWords: PropTypes.func.isRequired,
  leftQuery: PropTypes.object,
  rightQuery: PropTypes.object,
};

const mapStateToProps = state => ({
  lastSearchTime: state.explorer.lastSearchTime.time,
  fetchStatus: state.explorer.topWordsComparison.fetchStatus,
  results: state.explorer.topWordsComparison.list,
  leftQuery: state.explorer.topWordsComparison.left,
  rightQuery: state.explorer.topWordsComparison.right,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  selectComparativeWords: (query, target) => {
    dispatch(selectComparativeWordField({ query, target }));
  },
  updateCurrentQuery: (query, fieldName) => {
    if (query) {
      dispatch(updateQuery({ query, fieldName }));
    }
  },
  fetchData: (queries) => {
    // this should trigger when the user clicks the Search button or changes the URL
    // for n queries, run the dispatch with each parsed query
    dispatch(resetTopWordsComparison()); // necessary if a query deletion has occurred
    if (ownProps.isLoggedIn) {
      const runTheseQueries = queries || ownProps.queries;
      const comparedQueries = runTheseQueries.map(q => ({
        start_date: q.startDate || q.start_date,
        end_date: q.endDate || q.start_date,
        q: q.q,
        index: q.index,
        sources: q.sources.map(s => s.id || s.media_id),
        collections: q.collections.map(c => c.id || c.tags_id),
      }));
      return dispatch(fetchQueryTopWordsComparison(comparedQueries[0], comparedQueries[1]));
    }
    const runTheseQueries = queries || ownProps.queries;
    const comparedQueries = runTheseQueries.map(q => ({
      index: q.index, // should be same as q.index btw
      search_id: q.searchId, // may or may not have these
      query_id: q.id, // could be undefined
      q: q.q, // only if no query id, means demo user added a keyword
    }));
    return dispatch(fetchDemoQueryTopWordsComparison(comparedQueries[0], comparedQueries[1]));
  },
  handleWordCloudClick: (word) => {
    ownProps.onQueryModificationRequested(word.term);
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      if (ownProps.queries && ownProps.queries.length > 0) {
        if (ownProps.queries.length > 1) {
          dispatchProps.fetchData([ownProps.queries[0], ownProps.queries[1]]);
        } else {
          dispatchProps.fetchData([ownProps.queries[0]]);
        }
      }
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      composeAsyncContainer(
        QueryWordComparisonResultsContainer
      )
    )
  );
