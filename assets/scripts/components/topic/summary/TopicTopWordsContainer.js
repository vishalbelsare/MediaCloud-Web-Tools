import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import ErrorTryAgain from '../../util/ErrorTryAgain';
import LoadingSpinner from '../../util/LoadingSpinner';
import WordCloud from './WordCloud';
import { fetchTopicTopWords } from '../../../actions/topicActions';
import * as fetchConstants from '../../../lib/fetchConstants.js';
import { Row, Col } from 'react-flexbox-grid/lib';

const localMessages = {
  title: { id: 'topic.summary.topWords.title', defaultMessage: 'Top Words' },
};

class TopicTopStoriesContainer extends React.Component {
  componentDidMount() {
    const { topicId, snapshotId, fetchData } = this.props;
    fetchData(topicId, snapshotId);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.snapshotId !== this.props.snapshotId) {
      const { topicId, snapshotId, fetchData } = this.props;
      fetchData(topicId, snapshotId);
    }
  }
  getStyles() {
    const styles = {
      root: {
      },
    };
    return styles;
  }
  render() {
    const { topicId, fetchStatus, fetchData, words } = this.props;
    let content = fetchStatus;
    const styles = this.getStyles();
    switch (fetchStatus) {
      case fetchConstants.FETCH_SUCCEEDED:
        content = <WordCloud words={words} width={700} height={400} textColor={'#ff0000'} maxFontSize={32} />;
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
  words: React.PropTypes.array,
  topicId: React.PropTypes.number.isRequired,
  fetchData: React.PropTypes.func.isRequired,
  intl: React.PropTypes.object.isRequired,
  snapshotId: React.PropTypes.number,
};

const mapStateToProps = (state) => ({
  fetchStatus: state.topics.selected.summary.topWords.fetchStatus,
  words: state.topics.selected.summary.topWords.list,
  snapshotId: state.topics.selected.filters.snapshotId,
});

const mapDispatchToProps = (dispatch) => ({
  fetchData: (topicId, snapshotId) => {
    dispatch(fetchTopicTopWords(topicId, snapshotId));
  },
});

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(TopicTopStoriesContainer));
