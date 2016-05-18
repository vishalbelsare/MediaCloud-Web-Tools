import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import ErrorTryAgain from '../../util/ErrorTryAgain';
import LoadingSpinner from '../../util/LoadingSpinner';
import TopicTopStories from './TopicTopStories';
import { fetchTopicTopStories, sortTopicTopStories } from '../../../actions/topicActions';
import * as fetchConstants from '../../../lib/fetchConstants.js';
import Paper from 'material-ui/Paper';

const localMessages = {
  title: { id: 'topic.summary.topStories.title', defaultMessage: 'Top Stories' },
};

class TopicTopStoriesContainer extends React.Component {
  componentDidMount() {
    const { fetchStatus, topicId, snapshotId, fetchData, sort } = this.props;
    if (fetchStatus !== fetchConstants.FETCH_FAILED) {
      fetchData(topicId, snapshotId, sort);
    }
  }
  componentWillReceiveProps(nextProps) {
    if ((nextProps.snapshotId !== this.props.snapshotId) ||
        (nextProps.sort !== this.props.sort)) {
      const { topicId, fetchData } = this.props;
      fetchData(topicId, nextProps.snapshotId, nextProps.sort);
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
    const { topicId, fetchStatus, fetchData, stories, sort } = this.props;
    let content = fetchStatus;
    const styles = this.getStyles();
    switch (fetchStatus) {
      case fetchConstants.FETCH_SUCCEEDED:
        content = <TopicTopStories stories={stories} onChangeSort={this.onChangeSort} sortedBy={sort} />;
        break;
      case fetchConstants.FETCH_FAILED:
        content = <ErrorTryAgain onTryAgain={fetchData(topicId)} />;
        break;
      default:
        content = <LoadingSpinner />;
    }
    return (
      <div style={styles.root}>
        <Paper>
          <div style={styles.contentWrapper}>
            <h2><FormattedMessage {...localMessages.title} /></h2>
            {content}
          </div>
        </Paper>
      </div>
    );
  }
}

TopicTopStoriesContainer.propTypes = {
  fetchStatus: React.PropTypes.string.isRequired,
  sort: React.PropTypes.string.isRequired,
  stories: React.PropTypes.array,
  topicId: React.PropTypes.number.isRequired,
  fetchData: React.PropTypes.func.isRequired,
  sortData: React.PropTypes.func.isRequired,
  intl: React.PropTypes.object.isRequired,
  snapshotId: React.PropTypes.number,
};

const mapStateToProps = (state) => ({
  fetchStatus: state.topics.selected.summary.topStories.fetchStatus,
  sort: state.topics.selected.summary.topStories.sort,
  stories: state.topics.selected.summary.topStories.list,
  snapshotId: state.topics.selected.filters.snapshotId,
});

const mapDispatchToProps = (dispatch) => ({
  fetchData: (topicId, snapshotId, sort) => {
    dispatch(fetchTopicTopStories(topicId, snapshotId, sort));
  },
  sortData: (sort) => {
    dispatch(sortTopicTopStories(sort));
  },
});

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(TopicTopStoriesContainer));
