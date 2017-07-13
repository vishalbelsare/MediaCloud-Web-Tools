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
import messages from '../../../resources/messages';
import { getUserRoles, hasPermissions, PERMISSION_LOGGED_IN } from '../../../lib/auth';

// const NUM_TO_SHOW = 20;

// TODO check all these messages

const localMessages = {
  title: { id: 'explorer.stories.title', defaultMessage: 'Story Samples' },
  helpTitle: { id: 'explorer.stories.help.title', defaultMessage: 'About Story Samples' },
  helpText: { id: 'explorer.stories.help.text',
    defaultMessage: '<p>This chart shows you estimated coverage of your seed query</p>',
  },
  descriptionIntro: { id: 'explorer.stories.help.title', defaultMessage: 'This is a random sample of stories.' },
  tabStory: { id: 'explorer.stories.tab', defaultMessage: 'Tab for Query' },
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
        <Tabs>
          {results.map((storySet, idx) =>
            (<Tab label={queries && queries.length > idx ? queries[idx].q : 'empty'} key={idx}>
              <StoryTable
                stories={storySet}
                index={idx}
                onChangeFocusSelection={handleStorySelection}
                maxTitleLength={50}
              />
            </Tab>
            )
          )}
        </Tabs>
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
  sampleSearches: React.PropTypes.array, // TODO, could we get here without any sample searches? yes if logged in...
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
      state.queries.map((q, index) => dispatch(fetchQuerySampleStories(q, index)));
      // }
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
      composeDescribedDataCard(localMessages.descriptionIntro, [messages.storiesTableHelpText])(
        composeAsyncContainer(
          StorySamplePreview
        )
      )
    )
  );
