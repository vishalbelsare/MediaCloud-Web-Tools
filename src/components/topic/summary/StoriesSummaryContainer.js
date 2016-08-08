import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../common/AsyncContainer';
import { fetchTopicTopStories, sortTopicTopStories } from '../../../actions/topicActions';
import DataCard from '../../common/DataCard';
import ExploreButton from './ExploreButton';
import messages from '../../../resources/messages';
import StoryTable from '../StoryTable';

const localMessages = {
  title: { id: 'topic.summary.topStories.title', defaultMessage: 'Top Stories' },
};

const NUM_TO_SHOW = 10;

class StoriesSummaryContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    if ((nextProps.filters !== this.props.filters) ||
        (nextProps.sort !== this.props.sort)) {
      const { fetchData } = this.props;
      fetchData(nextProps);
    }
  }
  onChangeSort = (newSort) => {
    const { sortData } = this.props;
    sortData(newSort);
  };
  render() {
    const { stories, sort, topicId } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <DataCard>
        <div className="actions">
          <ExploreButton tooltip={formatMessage(messages.explore)} to={`/topics/${topicId}/stories`} />
        </div>
        <h2><FormattedMessage {...localMessages.title} /></h2>
        <StoryTable stories={stories} topicId={topicId} onChangeSort={this.onChangeSort} sortedBy={sort} />
      </DataCard>
    );
  }
}

StoriesSummaryContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
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

const mapDispatchToProps = (dispatch, ownProps) => ({
  asyncFetch: () => {
    dispatch(fetchTopicTopStories(ownProps.topicId, ownProps.filters.snapshotId, ownProps.filters.timespanId, ownProps.sort, NUM_TO_SHOW));
  },
  fetchData: (props) => {
    dispatch(fetchTopicTopStories(props.topicId, props.filters.snapshotId, props.filters.timespanId, props.sort, NUM_TO_SHOW));
  },
  sortData: (sort) => {
    dispatch(sortTopicTopStories(sort));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeAsyncContainer(
        StoriesSummaryContainer
      )
    )
  );
