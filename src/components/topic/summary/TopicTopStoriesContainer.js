import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncWidget from '../../util/composeAsyncWidget';
import TopicTopStories from './TopicTopStories';
import { fetchTopicTopStories, sortTopicTopStories } from '../../../actions/topicActions';
import Paper from 'material-ui/Paper';

const localMessages = {
  title: { id: 'topic.summary.topStories.title', defaultMessage: 'Top Stories' },
};

class TopicTopStoriesContainer extends React.Component {
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
  getStyles() {
    const styles = {
      contentWrapper: {
        padding: 10,
      },
    };
    return styles;
  }
  render() {
    const { stories, sort, topicId } = this.props;
    const styles = this.getStyles();
    return (
      <div style={styles.root}>
        <Paper>
          <div style={styles.contentWrapper}>
            <h2><FormattedMessage {...localMessages.title} /></h2>
            <TopicTopStories stories={stories} topicId={topicId} onChangeSort={this.onChangeSort} sortedBy={sort} />
          </div>
        </Paper>
      </div>
    );
  }
}

TopicTopStoriesContainer.propTypes = {
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
    dispatch(fetchTopicTopStories(ownProps.topicId, ownProps.filters.snapshotId, ownProps.filters.timespanId));
  },
  fetchData: (props) => {
    dispatch(fetchTopicTopStories(props.topicId, props.filters.snapshotId, props.filters.timespanId, props.sort));
  },
  sortData: (sort) => {
    dispatch(sortTopicTopStories(sort));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeAsyncWidget(
        TopicTopStoriesContainer
      )
    )
  );
