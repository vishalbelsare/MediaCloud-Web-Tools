import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import composeAsyncContainer from '../../common/AsyncContainer';
import DataCard from '../../common/DataCard';
import { fetchQueryTopWords, fetchDemoQueryTopWords } from '../../../actions/explorerActions';
import { generateParamStr } from '../../../lib/apiUtil';
import { queryPropertyHasChanged } from '../../../lib/explorerUtil';
import { getBrandDarkColor } from '../../../styles/colors';
import ComparativeOrderedWordCloud from '../../vis/ComparativeOrderedWordCloud';

const localMessages = {
  title: { id: 'explorer.comparativeWords.title', defaultMessage: 'Comparative Words' },
  intro: { id: 'explorer.comparativeWords.intro', defaultMessage: ' These words are the most used in each query. They are sized according to total count across all words in ...' },
  leftTitleMsg: { id: 'explorer.comparativeWords.left', defaultMessage: 'Comparative Words' },
  centerTitleMsg: { id: 'explorer.comparativeWords.center', defaultMessage: 'Comparative Words' },
  rightTitleMsg: { id: 'explorer.comparativeWords.right', defaultMessage: 'Comparative Words' },

};

const LEFT = 0;
const RIGHT = 1;

class ComparativeWordCloudContainer extends React.Component {
  state = {
    leftQuery: '',
    rightQuery: '',
  };
  componentWillReceiveProps(nextProps) {
    const { lastSearchTime, fetchData } = this.props;
    if (nextProps.lastSearchTime !== lastSearchTime) {
      fetchData(nextProps.queries);
    }
  }
  shouldComponentUpdate(nextProps) {
    const { results, queries } = this.props;
    // only re-render if results, any labels, or any colors have changed
    if (results.length) { // may have reset results so avoid test if results is empty
      const labelsHaveChanged = queryPropertyHasChanged(queries.slice(0, results.length), nextProps.queries.slice(0, results.length), 'label');
      const colorsHaveChanged = queryPropertyHasChanged(queries.slice(0, results.length), nextProps.queries.slice(0, results.length), 'color');
      return (
        ((labelsHaveChanged || colorsHaveChanged))
         || (results !== nextProps.results)
      );
    }
    return false; // if both results and queries are empty, don't update
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
  selectThisQuery = (value, targetIndex) => {
    // get value and which menu (left or right) and then run comparison
    // get query out of queries at queries[targetIndex] and pass "q" to fetch
    // store choice of selectField
    const { fetchData } = this.props;
    if (targetIndex === LEFT) {
      this.setState({ leftQuery: value.q });
    } else {
      this.setState({ rightQuery: value.q });
    }
    fetchData(this.state);
  }

  render() {
    const { queries, results, handleWordCloudClick } = this.props;
    const menuItems = queries.map(q =>
      <MenuItem value={q.q} primaryText={q.label} />
    );

    // test the results before we pass to cowc, are there two valid sets of arrays
    // const mergedResultsWithQueryInfo = results.map((r, idx) => Object.assign({}, r, queries[idx]));

    return (
      <Grid>
        <h2><FormattedMessage {...localMessages.title} /></h2>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <h1><FormattedMessage {...localMessages.title} /></h1>
            <p><FormattedMessage {...localMessages.intro} /></p>
          </Col>
        </Row>
        <Row>
          <Col>
            <SelectField
              floatingLabelText="Frequency"
              value={this.state.leftQuery}
              onChange={value => this.selectThisQuery(value, LEFT)}
            >
              {menuItems}
            </SelectField>
          </Col>
          <Col>
            <SelectField
              floatingLabelText="Frequency"
              value={this.state.rightQuery}
              onChange={value => this.selectThisQuery(value, RIGHT)}
            >
              {menuItems}
            </SelectField>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <DataCard>
              <ComparativeOrderedWordCloud
                leftWords={results[0]}
                rightWords={results[1]}
                textColor={getBrandDarkColor()}
                onWordClick={handleWordCloudClick}
                leftTitleMsg={localMessages.leftTitleMsg}
                centerTitleMsg={localMessages.centerTitleMsg}
                rightTitleMsg={localMessages.rightTitleMsg}
              />
            </DataCard>
          </Col>
        </Row>
      </Grid>
    );
  }

}

ComparativeWordCloudContainer.propTypes = {
  lastSearchTime: React.PropTypes.number.isRequired,
  queries: React.PropTypes.array.isRequired,
  // from composition
  intl: React.PropTypes.object.isRequired,
  // from dispatch
  fetchData: React.PropTypes.func.isRequired,
  results: React.PropTypes.array.isRequired,
  // from mergeProps
  asyncFetch: React.PropTypes.func.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  handleWordCloudClick: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  lastSearchTime: state.explorer.lastSearchTime.time,
  user: state.user,
  fetchStatus: state.explorer.topWords.fetchStatus,
  results: state.explorer.topWords.results,
});

const mapDispatchToProps = (dispatch, state) => ({
  fetchData: (queries) => {
    // this should trigger when the user clicks the Search button or changes the URL
    // for n queries, run the dispatch with each parsed query
    // dispatch(resetComparativeWordCloud()); // necessary if a query deletion has occurred
    if (state.user.isLoggedIn) {
      const runTheseQueries = queries || state.queries;
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
    } else if (queries || state.queries) { // else assume DEMO mode, but assume the queries have been loaded
      const runTheseQueries = queries || state.queries;
      runTheseQueries.map((q, index) => {
        const demoInfo = {
          index, // should be same as q.index btw
          search_id: q.searchId, // may or may not have these
          query_id: q.id, // could be undefined
          q: q.q, // only if no query id, means demo user added a keyword
        };
        return dispatch(fetchDemoQueryTopWords(demoInfo));
      });
    }
  },
  goToUrl: url => dispatch(push(url)),
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    handleWordCloudClick: (word) => {
      const params = generateParamStr({ ...stateProps.filters, stem: word.stem, term: word.term });
      const url = `/topics/${stateProps.topicId}/words/${word.stem}*?${params}`;
      dispatchProps.goToUrl(url);
    },
    asyncFetch: () => {
      dispatchProps.fetchData(ownProps.queries);
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      composeAsyncContainer(
        ComparativeWordCloudContainer
      )
    )
  );
