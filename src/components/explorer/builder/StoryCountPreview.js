import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import MenuItem from 'material-ui/MenuItem';
import composeAsyncContainer from '../../common/AsyncContainer';
import { fetchDemoQueryStoryCount, fetchQueryStoryCount, resetStoryCounts } from '../../../actions/explorerActions';
import composeDescribedDataCard from '../../common/DescribedDataCard';
import DataCard from '../../common/DataCard';
import { DownloadButton } from '../../common/IconButton';
import ActionMenu from '../../common/ActionMenu';
import BubbleRowChart from '../../vis/BubbleRowChart';
import { hasPermissions, getUserRoles, PERMISSION_LOGGED_IN } from '../../../lib/auth';
import { queryPropertyHasChanged, generateQueryParamString } from '../../../lib/explorerUtil';
import messages from '../../../resources/messages';
import { downloadSvg } from '../../util/svg';

const BUBBLE_CHART_DOM_ID = 'bubble-chart-story-total';

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
  // if demo, use only sample search queries to download
  downloadCsv = () => {
    const { queries } = this.props;
    let url = null;
    const testFirstQuery = queries[0];
    if (parseInt(testFirstQuery.searchId, 10) >= 0) {
      url = `/api/explorer/stories/count.csv/${testFirstQuery.searchId}`;
    } else {
      const unDeletedQueries = queries.filter(q => !q.deleted);
      const urlParamString = generateQueryParamString(unDeletedQueries);
      url = `/api/explorer/stories/count.csv/[${urlParamString}]`;
    }
    window.location = url;
  }
  render() {
    const { results, queries } = this.props;
    const { formatNumber, formatMessage } = this.props.intl;
    let content = null;

    const mergedResultsWithQueryInfo = results.map((r, idx) => Object.assign({}, r, queries[idx]));

    let bubbleData = [];
    if (mergedResultsWithQueryInfo !== undefined && mergedResultsWithQueryInfo !== null && mergedResultsWithQueryInfo.length > 0) {
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
            <MenuItem
              className="action-icon-menu-item"
              primaryText={formatMessage(messages.downloadCSV)}
              rightIcon={<DownloadButton />}
              onTouchTap={this.downloadCsv}
            />
            <MenuItem
              className="action-icon-menu-item"
              primaryText={formatMessage(messages.downloadSVG)}
              rightIcon={<DownloadButton />}
              onTouchTap={() => downloadSvg(BUBBLE_CHART_DOM_ID)}
            />
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
  // from mergeProps
  asyncFetch: React.PropTypes.func.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  lastSearchTime: state.explorer.lastSearchTime.time,
  user: state.user,
  fetchStatus: state.explorer.storyCount.fetchStatus,
  results: state.explorer.storyCount.results,
});

const mapDispatchToProps = (dispatch, state) => ({
  fetchData: (queries) => {
    /* this should trigger when the user clicks the Search button or changes the URL
     for n queries, run the dispatch with each parsed query
    */
    const isLoggedInUser = hasPermissions(getUserRoles(state.user), PERMISSION_LOGGED_IN);
    dispatch(resetStoryCounts());
    if (isLoggedInUser) {
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
        return dispatch(fetchQueryStoryCount(infoToQuery));
      });
    } else if (queries || state.queries) { // else assume DEMO mode, but assume the queries have been loaded
      const runTheseQueries = queries || state.queries;
      runTheseQueries.map((q, index) => {
        const demoInfo = {
          index, // should be same as q.index btw
          search_id: q.searchId, // may or may not have these
          query_id: q.id,
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
      dispatchProps.fetchData(ownProps.queries);
    },
  });
}
export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
       composeDescribedDataCard(localMessages.helpIntro, [localMessages.helpDetails])(
        composeAsyncContainer(
          StoryCountPreview
        )
      )
    )
  );
