import React from 'react';
import Title from 'react-title-component';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncWidget from '../util/composeAsyncWidget';
import LoadingSpinner from '../util/LoadingSpinner';
import { selectTopic, fetchTopicSummary } from '../../actions/topicActions';
import TopicControlBar from './controlbar/TopicControlBar';
import messages from '../../resources/messages';

class TopicContainer extends React.Component {
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
    const { filters } = this.props;
    const { topicId } = this.props.params;
    return ((topicId !== null) && (filters.snapshotId !== null) && (filters.timespanId !== null));
  }
  render() {
    const { children, topicInfo } = this.props;
    const topicId = parseInt(this.props.params, 10);
    const { formatMessage } = this.props.intl;
    const title = formatMessage(messages.topicName);
    const titleHandler = parentTitle => `${title} | ${parentTitle}`;
    const styles = this.getStyles();
    let subContent = <div />;
    if (this.filtersAreSet()) {
      subContent = children;
    } else {
      subContent = <LoadingSpinner />;
    }
    return (
      <div style={styles.root}>
        <div>
          <Title render={titleHandler} />
          <TopicControlBar topicId={topicId} title={topicInfo.name} />
          {subContent}
        </div>
      </div>
    );
  }
}

TopicContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  children: React.PropTypes.node,
  // from dispatch
  asyncFetch: React.PropTypes.func.isRequired,
  // params from router
  params: React.PropTypes.object.isRequired,
  filters: React.PropTypes.object.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  topicInfo: React.PropTypes.object,
};

const mapStateToProps = (state) => ({
  filters: state.topics.selected.filters,
  fetchStatus: state.topics.selected.info.fetchStatus,
  topicInfo: state.topics.selected.info,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  asyncFetch: () => {
    dispatch(selectTopic(ownProps.params.topicId));
    dispatch(fetchTopicSummary(ownProps.params.topicId));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
        composeAsyncWidget(
          TopicContainer
        )
      )
  );
