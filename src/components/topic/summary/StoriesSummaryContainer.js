import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../common/AsyncContainer';
import composeHelpfulContainer from '../../common/HelpfulContainer';
import { fetchTopicTopStories, sortTopicTopStories } from '../../../actions/topicActions';
import DataCard from '../../common/DataCard';
import { ExploreButton } from '../../common/IconButton';
import StoryTable from '../StoryTable';

const localMessages = {
  title: { id: 'topic.summary.words.title', defaultMessage: 'Top Stories' },
  helpTitle: { id: 'topic.summary.stories.help.title', defaultMessage: 'About Top Stories' },
  helpText: { id: 'topic.summary.stories.help.text',
    defaultMessage: '<p>This table shows you the top stories in your Topic.  The column currently being used to sort the results has a little down arrow next to it.  Click one of the green column headers to change how it is sorted.  Here is a summary of the columns:</p><ul><li>Title: the title of the story; click to see details about this story</li><li>Media Source: the name of the Media Source; click to see details about this source\'s content within this Topic</li><li>Publish Date: our best guess of the date and time this content was published</li><li>Media Inlinks: how many unique other Media Sources have links to this content in the Topic</li><li>Outlinks: the number of links in this story to other stories</li><li>Bit.ly Clicks: the number of clicks on links to this story shortened using the Bit.ly URL shortening service</li><li>Facebook Shares: the number of times this story was shared on Facebook</li></ul>',
  },
};

const NUM_TO_SHOW = 10;

class StoriesSummaryContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { filters, sort, fetchData } = this.props;
    if ((nextProps.filters.timespanId !== filters.timespanId) ||
        (nextProps.sort !== sort)) {
      fetchData(nextProps);
    }
  }
  onChangeSort = (newSort) => {
    const { sortData } = this.props;
    sortData(newSort);
  };
  render() {
    const { stories, sort, topicId, helpButton } = this.props;
    return (
      <DataCard>
        <div className="actions">
          <ExploreButton linkTo={`/topics/${topicId}/stories`} />
        </div>
        <h2>
          <FormattedMessage {...localMessages.title} />
          {helpButton}
        </h2>
        <StoryTable stories={stories} topicId={topicId} onChangeSort={this.onChangeSort} sortedBy={sort} />
      </DataCard>
    );
  }
}

StoriesSummaryContainer.propTypes = {
  // from the composition chain
  intl: React.PropTypes.object.isRequired,
  helpButton: React.PropTypes.node.isRequired,
  // from parent
  topicId: React.PropTypes.number.isRequired,
  filters: React.PropTypes.object.isRequired,
  // from dispatch
  fetchData: React.PropTypes.func.isRequired,
  sortData: React.PropTypes.func.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  sort: React.PropTypes.string.isRequired,
  stories: React.PropTypes.array,
};

const mapStateToProps = (state) => ({
  fetchStatus: state.topics.selected.summary.topStories.fetchStatus,
  sort: state.topics.selected.summary.topStories.sort,
  stories: state.topics.selected.summary.topStories.stories,
});

const mapDispatchToProps = (dispatch) => ({
  fetchData: (props) => {
    const params = {
      ...props.filters,
      sort: props.sort,
      limit: NUM_TO_SHOW,
    };
    dispatch(fetchTopicTopStories(props.topicId, params));
  },
  sortData: (sort) => {
    dispatch(sortTopicTopStories(sort));
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
      composeHelpfulContainer(localMessages.helpTitle, localMessages.helpText)(
        composeAsyncContainer(
          StoriesSummaryContainer
        )
      )
    )
  );
