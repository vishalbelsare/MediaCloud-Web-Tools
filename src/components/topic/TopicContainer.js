import React from 'react';
import Title from 'react-title-component';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncWidget from '../util/composeAsyncWidget';
import LoadingSpinner from '../util/LoadingSpinner';
import { selectTopic, fetchTopicSummary } from '../../actions/topicActions';
import ControlBar from './controlbar/ControlBar';
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
    const { filters, topicId } = this.props;
    return ((topicId !== null) && (filters.snapshotId !== null) && (filters.timespanId !== null));
  }
  render() {
    const { children, topicInfo, location, topicId } = this.props;
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
          <ControlBar topicId={topicId} title={topicInfo.name} location={location} />
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
  location: React.PropTypes.object.isRequired,
  topicId: React.PropTypes.number.isRequired,
  // from dispatch
  asyncFetch: React.PropTypes.func.isRequired,
  // params from router
  // from state
  filters: React.PropTypes.object.isRequired,
  fetchStatus: React.PropTypes.string.isRequired,
  topicInfo: React.PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
  filters: state.topics.selected.filters,
  fetchStatus: state.topics.selected.info.fetchStatus,
  topicInfo: state.topics.selected.info,
  topicId: parseInt(ownProps.params.topicId, 10),
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
