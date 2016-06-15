import React from 'react';
import Title from 'react-title-component';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import LoadingSpinner from '../util/LoadingSpinner';
import ErrorTryAgain from '../util/ErrorTryAgain';
import { selectTopic, fetchTopicSummary } from '../../actions/topicActions';
import TopicControlBar from './controlbar/TopicControlBar';
import messages from '../../resources/messages';
import * as fetchConstants from '../../lib/fetchConstants.js';

class TopicContainer extends React.Component {
  componentDidMount() {
    const { params, fetchData } = this.props;
    fetchData(params.topicId);
  }
  getStyles() {
    const styles = {
      root: {
      },
      row: {
        marginBottom: 15,
      },
    };
    return styles;
  }
  filtersAreSet() {
    const { filters, topicId } = this.props;
    return ((topicId !== null) && (filters.snapshotId !== null) && (filters.timespanId !== null));
  }
  render() {
    const { children, topicId, topicInfo, fetchData } = this.props;
    const { formatMessage } = this.props.intl;
    const title = formatMessage(messages.topicName);
    const titleHandler = parentTitle => `${title} | ${parentTitle}`;
    const styles = this.getStyles();
    let content = <div />;
    switch (topicInfo.fetchStatus) {
      case fetchConstants.FETCH_SUCCEEDED:
        let subContent = <div />;
        if (this.filtersAreSet()) {
          subContent = children;
        } else {
          subContent = <LoadingSpinner />;
        }
        content = (
          <div>
            <Title render={titleHandler} />
            <TopicControlBar topicId={topicId} title={topicInfo.name} />
            {subContent}
          </div>
        );
        break;
      case fetchConstants.FETCH_FAILED:
        content = <ErrorTryAgain onTryAgain={fetchData(topicId)} />;
        break;
      default:
        content = <LoadingSpinner />;
    }
    return (
      <div style={styles.root}>
        <div>
          {content}
        </div>
      </div>
    );
  }
}

TopicContainer.propTypes = {
  children: React.PropTypes.node,
  intl: React.PropTypes.object.isRequired,
  fetchData: React.PropTypes.func.isRequired,
  filters: React.PropTypes.object.isRequired,
  params: React.PropTypes.object.isRequired,       // params from router
  topicId: React.PropTypes.number,
  topicInfo: React.PropTypes.object,
};

const mapStateToProps = (state) => ({
  filters: state.topics.selected.filters,
  topicId: state.topics.selected.id,
  topicInfo: state.topics.selected.info,
});

const mapDispatchToProps = (dispatch) => ({
  fetchData: (topicId) => {
    dispatch(selectTopic(topicId));
    dispatch(fetchTopicSummary(topicId));
  },
});

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(TopicContainer));
