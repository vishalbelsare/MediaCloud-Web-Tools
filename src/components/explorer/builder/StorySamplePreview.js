import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'material-ui/Tabs';
import MenuItem from 'material-ui/MenuItem';
import composeDescribedDataCard from '../../common/DescribedDataCard';
import DataCard from '../../common/DataCard';
import composeAsyncContainer from '../../common/AsyncContainer';
import { DownloadButton } from '../../common/IconButton';
import ActionMenu from '../../common/ActionMenu';
import StoryTable from '../../common/StoryTable';
import { fetchQuerySampleStories, fetchDemoQuerySampleStories } from '../../../actions/explorerActions';
import { getUserRoles, hasPermissions, PERMISSION_LOGGED_IN } from '../../../lib/auth';

// const NUM_TO_SHOW = 20;
const DEFAULT_SOURCES = '';
const DEFAULT_COLLECTION = 9139487;
// TODO check all these messages

const localMessages = {
  title: { id: 'explorer.stories.title', defaultMessage: 'Sample Stories' },
  helpIntro: { id: 'explorer.stories.help.title', defaultMessage: '<p>This is a small sample of the stories matching your queries.  These are stories where are least one sentence matches your query.  Click on story title to read it.  Click the menu on the top right to download a CSV of stories with their urls.</p>' },
  helpDetails: { id: 'explorer.stories.help.text',
    defaultMessage: '<p>Due to copyright restrictions we cannot provide you with the original full text of the stories.</p>',
  },
  downloadCSV: { id: 'explorer.attention.downloadcsv', defaultMessage: 'Download {name}' },
};

class StorySamplePreview extends React.Component {
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
      url = `/api/explorer/stories/samples.csv/${query.searchId}/${query.index}`;
    } else {
      url = `/api/explorer/stories/samples.csv/[{"q":"${query.q}"}]/${query.index}`;
    }
    window.location = url;
  }
  render() {
    const { results, queries, handleStorySelection } = this.props;
    const { formatMessage } = this.props.intl;
    let storyListContent;
    // if there is only one query, don't show tabs
    if (queries.length === 1) {
      storyListContent = (
        <StoryTable
          className="story-table"
          stories={results[0]}
          onChangeFocusSelection={handleStorySelection}
          maxTitleLength={50}
        />
      );
    } else {
      storyListContent = (
        <Tabs>
          {results.map((storySet, idx) => (
            <Tab label={queries && queries.length > idx ? queries[idx].q : 'empty'} key={idx}>
              <StoryTable
                className="story-table"
                stories={storySet}
                index={idx}
                onChangeFocusSelection={handleStorySelection}
                maxTitleLength={50}
              />
            </Tab>
          ))}
        </Tabs>
      );
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
        <h2><FormattedMessage {...localMessages.title} /></h2>
        <br />
        {storyListContent}
      </DataCard>
    );
  }
}

StorySamplePreview.propTypes = {
  lastSearchTime: React.PropTypes.number.isRequired,
  queries: React.PropTypes.array.isRequired,
  // from composition
  intl: React.PropTypes.object.isRequired,
  // from dispatch
  fetchData: React.PropTypes.func.isRequired,
  results: React.PropTypes.array.isRequired,
  urlQueryString: React.PropTypes.object.isRequired,
  // from mergeProps
  asyncFetch: React.PropTypes.func.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  handleStorySelection: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  lastSearchTime: state.explorer.lastSearchTime.time,
  user: state.user,
  urlQueryString: ownProps.params,
  fetchStatus: state.explorer.stories.fetchStatus,
  results: state.explorer.stories.results,
});

const mapDispatchToProps = (dispatch, state) => ({
  fetchData: (ownProps, queries) => {
    // this should trigger when the user clicks the Search button or changes the URL
    // for n queries, run the dispatch with each parsed query

    const isLoggedInUser = hasPermissions(getUserRoles(state.user), PERMISSION_LOGGED_IN);
    if (isLoggedInUser) {
      // if (idx) { // specific change/update here
      //  dispatch(fetchQuerySampleStories(query, idx));
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
        return dispatch(fetchQuerySampleStories(infoToQuery));
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
        return dispatch(fetchDemoQuerySampleStories(demoInfo)); // id
      });
    }
  },
  handleStorySelection: () => 'true',
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
      composeDescribedDataCard(localMessages.helpIntro, [localMessages.helpDetails])(
        composeAsyncContainer(
          StorySamplePreview
        )
      )
    )
  );
