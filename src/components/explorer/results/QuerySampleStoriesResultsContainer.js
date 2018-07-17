import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import MenuItem from 'material-ui/MenuItem';
import composeSummarizedVisualization from './SummarizedVizualization';
import withAsyncFetch from '../../common/hocs/AsyncContainer';
import { DownloadButton } from '../../common/IconButton';
import ActionMenu from '../../common/ActionMenu';
import StoryTable from '../../common/StoryTable';
import { fetchQuerySampleStories, fetchDemoQuerySampleStories, resetSampleStories } from '../../../actions/explorerActions';
import { selectStory, resetStory } from '../../../actions/storyActions';
import { postToDownloadUrl } from '../../../lib/explorerUtil';
import messages from '../../../resources/messages';
import composeQueryResultsSelector from './QueryResultsSelector';

const localMessages = {
  title: { id: 'explorer.stories.title', defaultMessage: 'Sample Stories' },
  helpIntro: { id: 'explorer.stories.help.title', defaultMessage: '<p>This is a random sample of the stories matching your queries.  These are stories where are least one sentence matches your query.  Click on story title to read it.  Click the menu on the bottom right to download a CSV of stories with their urls.</p>' },
  helpDetails: { id: 'explorer.stories.help.text',
    defaultMessage: '<p>We can provide basic information about stories like the media source, date of publication, and URL.  However, due to copyright restrictions we cannot provide you with the original full text of the stories. Download the CSV results to see all the metadata we have about the stories.</p>',
  },
  downloadCsv: { id: 'explorer.stories.downloadCsv', defaultMessage: 'Download { name } sampled stories CSV' },
};

class QuerySampleStoriesResultsContainer extends React.Component {
  onStorySelection = (selectedStory, target) => {
    const { handleStorySelection, selectedQuery } = this.props;
    const allEvenElements = Array.from(document.getElementsByClassName('even'));
    const allOddElements = Array.from(document.getElementsByClassName('odd'));
    const arr = allEvenElements.concat(allOddElements);
    arr.forEach((ele) => {
      ele.classList.remove('selected');
    });
    target.parentElement.parentElement.classList.add('selected');
    handleStorySelection(selectedQuery, selectedStory);
  }
  downloadCsv = (query) => {
    postToDownloadUrl('/api/explorer/stories/samples.csv', query);
  }
  render() {
    const { results, queries, selectedTabIndex, tabSelector } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <div>
        {tabSelector}
        <StoryTable
          className="story-table"
          stories={results[selectedTabIndex] ? results[selectedTabIndex].slice(0, 10) : []}
          onChangeFocusSelection={(story, target) => this.onStorySelection(story, target)}
          maxTitleLength={50}
        />
        <div className="actions">
          <ActionMenu actionTextMsg={messages.downloadOptions}>
            {queries.map((q, idx) =>
              <MenuItem
                key={idx}
                className="action-icon-menu-item"
                primaryText={formatMessage(localMessages.downloadCsv, { name: q.label })}
                rightIcon={<DownloadButton />}
                onTouchTap={() => this.downloadCsv(q)}
              />
            )}
          </ActionMenu>
        </div>
      </div>
    );
  }
}

QuerySampleStoriesResultsContainer.propTypes = {
  lastSearchTime: PropTypes.number.isRequired,
  queries: PropTypes.array.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  // from composition
  intl: PropTypes.object.isRequired,
  // from dispatch
  fetchData: PropTypes.func.isRequired,
  results: PropTypes.array.isRequired,
  // from mergeProps
  asyncFetch: PropTypes.func.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  handleStorySelection: PropTypes.func.isRequired,
  selectedTabIndex: PropTypes.number.isRequired,
  selectedQuery: PropTypes.object.isRequired,
  tabSelector: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  lastSearchTime: state.explorer.lastSearchTime.time,
  fetchStatus: state.explorer.stories.fetchStatus,
  results: state.explorer.stories.results,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (queries) => {
    // this should trigger when the user clicks the Search button or changes the URL
    // for n queries, run the dispatch with each parsed query
    dispatch(resetStory());
    dispatch(resetSampleStories());
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
        return dispatch(fetchQuerySampleStories(infoToQuery));
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
        return dispatch(fetchDemoQuerySampleStories(demoInfo)); // id
      });
    }
  },
  handleStorySelection: (query, story) => {
    dispatch(selectStory(story));
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
      composeSummarizedVisualization(localMessages.title, localMessages.helpIntro, localMessages.helpDetails)(
        withAsyncFetch(
          composeQueryResultsSelector(
            QuerySampleStoriesResultsContainer
          )
        )
      )
    )
  );
