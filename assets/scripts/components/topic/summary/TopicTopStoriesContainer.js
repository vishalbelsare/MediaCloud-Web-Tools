import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import ErrorTryAgain from '../../util/ErrorTryAgain';
import LoadingSpinner from '../../util/LoadingSpinner';
import TopicTopStories from './TopicTopStories';
import { fetchTopicTopStories } from '../../../actions/topicActions';
import * as fetchConstants from '../../../lib/fetchConstants.js';
import { Row, Col } from 'react-flexbox-grid/lib';

const localMessages = {
  title: { id: 'topic.summary.topStories.title', defaultMessage: 'Top Stories' },
};

class TopicTopStoriesContainer extends React.Component {
  componentDidMount() {
    const { topicId, snapshotId, fetchData, sort } = this.props;
    fetchData(topicId, snapshotId, sort);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.snapshotId !== this.props.snapshotId) {
      const { topicId, snapshotId, fetchData, sort } = this.props;
      fetchData(topicId, snapshotId, sort);
    }
  }
  onChangeSort = (newSort) => {
    const { topicId, fetchData } = this.props;
    fetchData(topicId, newSort);
  };
  getStyles() {
    const styles = {
      root: {
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
        <Row>
          <Col lg={12}>
            <h2><FormattedMessage {...localMessages.title} /></h2>
            {content}
          </Col>
        </Row>
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
});

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(TopicTopStoriesContainer));
