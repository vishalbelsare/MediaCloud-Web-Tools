import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import MenuItem from 'material-ui/MenuItem';
import composeAsyncContainer from '../../common/AsyncContainer';
import { fetchDemoQueryStoryCount, fetchQueryStoryCount } from '../../../actions/explorerActions';
import composeDescribedDataCard from '../../common/DescribedDataCard';
import DataCard from '../../common/DataCard';
import { DownloadButton } from '../../common/IconButton';
import ActionMenu from '../../common/ActionMenu';
import BubbleRowChart from '../../vis/BubbleRowChart';
import messages from '../../../resources/messages';
import { hasPermissions, getUserRoles, PERMISSION_LOGGED_IN } from '../../../lib/auth';

const BUBBLE_CHART_DOM_ID = 'bubble-chart-story-total';
const DEFAULT_SOURCES = '';
const DEFAULT_COLLECTION = 9139487;

const localMessages = {
  title: { id: 'explorer.storyCount.title', defaultMessage: 'Total Stories' },
  helpIntro: { id: 'explorer.storyCount.help.into',
    defaultMessage: '<p>Compare the total number of stories where at least one sentence matched each of your queries.  Rollover the cirlces to see the exact numbers, or click the menu in the top right to download the data.</p>',
  },
  helpDetails: { id: 'explorer.storyCount.help.details',
    defaultMessage: '<p></p>',
  },
  downloadCSV: { id: 'explorer.attention.downloadcsv', defaultMessage: 'Download {name}' },
};

class StoryCountPreview extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { urlQueryString, lastSearchTime, fetchData } = this.props;
    if (nextProps.lastSearchTime !== lastSearchTime ||
      nextProps.urlQueryString !== urlQueryString) {
    // TODO also check for name and color changes
      fetchData(nextProps.urlQueryString, nextProps.queries);
    }
  }
  downloadCsv = (query) => {
    let url = null;
    if (parseInt(query.searchId, 10) >= 0) {
      url = `/api/explorer/stories/count.csv/${query.searchId}/${query.index}`;
    } else {
      url = `/api/explorer/stories/count.csv/[{"q":"${query.q}"}]/${query.index}`;
    }
    window.location = url;
  }
  render() {
    const { results, queries } = this.props;
    const { formatNumber, formatMessage } = this.props.intl;
    let content = null;

    const mergedResultsWithQueryInfo = results.map((r, idx) => Object.assign({}, r, queries[idx]));

    let bubbleData = [];
    if (mergedResultsWithQueryInfo !== undefined && mergedResultsWithQueryInfo.length > 0) {
      bubbleData = [
        ...mergedResultsWithQueryInfo.sort((a, b) => b.count - a.count).map((query, idx) => ({
          value: query.count,
          aboveText: (idx % 2 === 0) ? query.label : null,
          belowText: (idx % 2 !== 0) ? query.label : null,
          rolloverText: `${query.q}: ${formatNumber(query.count)}`,
          fill: query.color,
        })),
      ];
      content = (<BubbleRowChart
        data={bubbleData}
        padding={0}
        domId={BUBBLE_CHART_DOM_ID}
        width={440}
      />);
    }
    return (
      <DataCard>
        <div className="actions">
          <ActionMenu>
            {queries.map((q, idx) =>
              <MenuItem
                key={idx}
                className="action-icon-menu-item"
                primaryText={formatMessage(localMessages.downloadCSV, { name: q.label })}
                rightIcon={<DownloadButton />}
                onTouchTap={() => this.downloadCsv(q)}
              />
            )}
          </ActionMenu>
        </div>
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
  fetchData: (ownProps, queries) => {
    /* this should trigger when the user clicks the Search button or changes the URL
     for n queries, run the dispatch with each parsed query
    */

    const isLoggedInUser = hasPermissions(getUserRoles(state.user), PERMISSION_LOGGED_IN);
    if (isLoggedInUser) {
      // if (idx) { // specific change/update here
      //  dispatch(fetchQueryStoryCount(query, idx));
      // } else { // get all results
      state.queries.map((q) => {
        const infoToQuery = {
          start_date: q.startDate,
          end_date: q.endDate,
          q: q.q,
          index: q.index,
          sources: [DEFAULT_SOURCES],
          collections: [DEFAULT_COLLECTION],
        };
        return dispatch(fetchQueryStoryCount(infoToQuery));
      });
    } else if (queries || state.queries) { // else assume DEMO mode, but assume the queries have been loaded
      const runTheseQueries = queries || state.queries;
      runTheseQueries.map((q, index) => {
        const demoInfo = {
          index, // should be same as q.index btw
          search_id: q.searchId, // may or may not have these
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
      dispatchProps.fetchData(ownProps);
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
