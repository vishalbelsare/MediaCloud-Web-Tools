import React from 'react';
import * as d3 from 'd3';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../common/AsyncContainer';
import { fetchDemoQueryStoryCount, fetchQueryStoryCount } from '../../../actions/explorerActions';
import composeDescribedDataCard from '../../common/DescribedDataCard';
import DataCard from '../../common/DataCard';
import BubbleRowChart from '../../vis/BubbleRowChart';
import messages from '../../../resources/messages';
import { hasPermissions, getUserRoles, PERMISSION_LOGGED_IN } from '../../../lib/auth';

const BUBBLE_CHART_DOM_ID = 'bubble-chart-story-total';
const TOP_N_LABELS_TO_SHOW = 3;
const COLORS = d3.schemeCategory10;

const localMessages = {
  title: { id: 'explorer.storyCount.title', defaultMessage: 'Seed Stories' },
  descriptionIntro: { id: 'explorer.storyCount.help.into',
    defaultMessage: 'A topic can include up to 100,000 stories.',
  },
  totalRolloverLabel: { id: 'explorer.storyCount.total', defaultMessage: 'All Stories' },
  totalLabel: { id: 'explorer.storyCount.total', defaultMessage: 'Total Stories' },
};

class StoryCountPreview extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { urlQueryString, lastSearchTime, fetchData } = this.props;
    if (nextProps.lastSearchTime !== lastSearchTime ||
      nextProps.urlQueryString.searchId !== urlQueryString.searchId) {
    // TODO also check for name and color changes
      fetchData(nextProps.urlQueryString.searchId);
    }
  }
  render() {
    const { results, queries } = this.props;
    const { formatNumber } = this.props.intl;
    let content = null;

    const mergedResultsWithQueryInfo = results.map((r, idx) => Object.assign({}, r, queries[idx]));

    let bubbleData = [];
    if (mergedResultsWithQueryInfo !== undefined && mergedResultsWithQueryInfo.length > 0) {
      bubbleData = [
        ...mergedResultsWithQueryInfo.sort((a, b) => b.count - a.count).map((query, idx) => ({
          value: query.count,
          centerText: (idx < TOP_N_LABELS_TO_SHOW) ? query.q : null,
          rolloverText: `${query.q}: ${formatNumber(query.count)}`,
          fill: COLORS[idx + 1],
        })),
      ];
      content = (<BubbleRowChart
        data={bubbleData}
        padding={220}
        domId={BUBBLE_CHART_DOM_ID}
        width={440}
      />);
    }
    return (
      <DataCard>
        <h2>
          <FormattedMessage {...localMessages.title} />
        </h2>
        {content}
      </DataCard>
    );
  }
}

StoryCountPreview.propTypes = {
  lastSearchTime: React.PropTypes.number.isRequired,
  queries: React.PropTypes.array.isRequired,
  user: React.PropTypes.object.isRequired,
  // from composition
  intl: React.PropTypes.object.isRequired,
  // from dispatch
  fetchData: React.PropTypes.func.isRequired,
  results: React.PropTypes.array.isRequired,
  urlQueryString: React.PropTypes.object.isRequired,
  sampleSearches: React.PropTypes.array, // TODO, could we get here without any sample searches? yes if logged in...
  // from mergeProps
  asyncFetch: React.PropTypes.func.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  lastSearchTime: state.explorer.lastSearchTime.time,
  user: state.user,
  urlQueryString: ownProps.params,
  fetchStatus: state.explorer.storyCount.fetchStatus,
  results: state.explorer.storyCount.results,
});

const mapDispatchToProps = (dispatch, state) => ({
  fetchData: (query, idx) => {
    // this should trigger when the user clicks the Search button or changes the URL
    // for n queries, run the dispatch with each parsed query

    const isLoggedInUser = hasPermissions(getUserRoles(state.user), PERMISSION_LOGGED_IN);
    if (isLoggedInUser) {
      if (idx) { // specific change/update here
        dispatch(fetchQueryStoryCount(query, idx));
      } else { // get all results
        state.queries.map((q, index) => dispatch(fetchQueryStoryCount(q, index)));
      }
    } else if (state.params && state.params.searchId) { // else assume DEMO mode
      let runTheseQueries = state.sampleSearches[state.params.searchId].data;
      // merge sample search queries with custom

      // find queries on stack without id but with index and with q, and add?
      const newQueries = state.queries.filter(q => q.id === undefined && q.index);
      runTheseQueries = runTheseQueries.concat(newQueries);
      runTheseQueries.map((q, index) => {
        const demoInfo = {
          index, // should be same as q.index btw
          search_id: state.params.searchId, // may or may not have these
          query_id: q.id, // TODO if undefined, what to do?
          q: q.q, // only if no query id, means demo user added a keyword
        };
        return dispatch(fetchDemoQueryStoryCount(demoInfo)); // id
      });
    }
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData();
    },
  });
}
export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
       composeDescribedDataCard(localMessages.descriptionIntro, [messages.storyCountHelpText])(
        composeAsyncContainer(
          StoryCountPreview
        )
      )
    )
  );
