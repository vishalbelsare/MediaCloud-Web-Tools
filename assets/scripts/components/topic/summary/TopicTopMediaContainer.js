import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import ErrorTryAgain from '../../util/ErrorTryAgain';
import LoadingSpinner from '../../util/LoadingSpinner';
import TopicTopMedia from './TopicTopMedia';
import { fetchTopicTopMedia } from '../../../actions/topicActions';
import * as fetchConstants from '../../../lib/fetchConstants.js';
import { Row, Col } from 'react-flexbox-grid/lib';

const localMessages = {
  title: { id: 'topic.summary.topMedia.title', defaultMessage: 'Top Media' },
};

class TopicTopMediaContainer extends React.Component {
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
    const { topicId, snapshotId, fetchData } = this.props;
    fetchData(topicId, snapshotId, newSort);
  }
  getStyles() {
    const styles = {
      root: {
      },
    };
    return styles;
  }
  render() {
    const { topicId, fetchStatus, fetchData, media, sort, snapshotId } = this.props;
    let content = fetchStatus;
    const styles = this.getStyles();
    switch (fetchStatus) {
      case fetchConstants.FETCH_SUCCEEDED:
        content = <TopicTopMedia media={media} onChangeSort={this.onChangeSort} sortedBy={sort} />;
        break;
      case fetchConstants.FETCH_FAILED:
        content = <ErrorTryAgain fetchData={fetchData(topicId)} />;
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

TopicTopMediaContainer.propTypes = {
  fetchStatus: React.PropTypes.string.isRequired,
  sort: React.PropTypes.string.isRequired,
  media: React.PropTypes.array,
  topicId: React.PropTypes.number.isRequired,
  fetchData: React.PropTypes.func.isRequired,
  intl: React.PropTypes.object.isRequired,
  snapshotId: React.PropTypes.number,
};

const mapStateToProps = (state) => ({
  fetchStatus: state.topics.selected.summary.topMedia.fetchStatus,
  sort: state.topics.selected.summary.topMedia.sort,
  media: state.topics.selected.summary.topMedia.list,
  snapshotId: state.topics.selected.filters.snapshotId,
});

const mapDispatchToProps = (dispatch) => ({
  fetchData: (topicId, snapshotId, sort) => {
    dispatch(fetchTopicTopMedia(topicId, snapshotId, sort));
  },
});

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(TopicTopMediaContainer));
