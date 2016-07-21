import React from 'react';
import Title from 'react-title-component';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncWidget from '../util/composeAsyncWidget';
import LoadingSpinner from '../common/LoadingSpinner';
import { selectTopic, fetchTopicSummary } from '../../actions/topicActions';
import ControlBar from './controlbar/ControlBar';
import messages from '../../resources/messages';

class TopicContainer extends React.Component {
  filtersAreSet() {
    const { filters, topicId } = this.props;
    return ((topicId !== null) && (filters.snapshotId !== null) && (filters.timespanId !== null));
  }
  render() {
    const { children, topicInfo, location, topicId } = this.props;
    const { formatMessage } = this.props.intl;
    const title = formatMessage(messages.topicName);
    const titleHandler = parentTitle => `${title} | ${parentTitle}`;
    let subContent = <div />;
    if (this.filtersAreSet()) {
      subContent = children;
    } else {
      subContent = <LoadingSpinner />;
    }
    return (
      <div>
        <ControlBar topicId={topicId} title={topicInfo.name} location={location} />
        {subContent}
      </div>
    );
  }
}

TopicContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  children: React.PropTypes.node,
  location: React.PropTypes.object.isRequired,
  // from state
  filters: React.PropTypes.object.isRequired,
  topicId: React.PropTypes.number.isRequired,
  topicInfo: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  filters: state.topics.selected.filters,
  topicId: state.topics.selected.id,
  topicInfo: state.topics.selected.info,
});

export default 
  injectIntl(
    connect(mapStateToProps, null)(
      TopicContainer
    )
  );
