import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../common/AsyncContainer';
import { fetchTopicEnglishStoryCounts } from '../../../actions/topicActions';
import StatBar from '../../common/statbar/StatBar';
import messages from '../../../resources/messages';

const localMessages = {
  storyLinkCount: { id: 'topic.summary.timespanInfo.storyLinkCount', defaultMessage: 'Story Links' },
  mediumCount: { id: 'topic.summary.timespanInfo.mediumCount', defaultMessage: 'Media Sources' },
  mediumLinkCount: { id: 'topic.summary.timespanInfo.mediumLinkCount', defaultMessage: 'Media Links' },
  geocodedCount: { id: 'topic.summary.timespanInfo.geocodedCount', defaultMessage: 'Geocoded Stories' },
  englishCount: { id: 'topic.summary.timespanInfo.englishCount', defaultMessage: 'English Stories' },
  storyCount: { id: 'topic.summary.timespanInfo.storyCount', defaultMessage: 'Total Stories' },
};

class TopicStoryStatsContainer extends React.Component {

  componentWillReceiveProps(nextProps) {
    const { filters, fetchData } = this.props;
    if ((nextProps.filters !== filters)) {
      fetchData(nextProps.filters);
    }
  }

  render() {
    const { timespan, storyCount, filters } = this.props;
    const { formatNumber, formatMessage } = this.props.intl;
    if ((timespan === null) || (timespan === undefined)) {
      return null;
    }
    let stats;
    if (filters.q) {
      stats = [
        { message: localMessages.storyCount, data: formatNumber(storyCount) },
        { message: localMessages.mediumCount, data: formatMessage(messages.unknown) },
        { message: localMessages.storyLinkCount, data: formatMessage(messages.unknown) },
        { message: localMessages.mediumLinkCount, data: formatMessage(messages.unknown) },
      ];
    } else {
      stats = [
        { message: localMessages.storyCount, data: formatNumber(storyCount) },
        { message: localMessages.mediumCount, data: formatNumber(timespan.medium_count) },
        { message: localMessages.storyLinkCount, data: formatNumber(timespan.story_link_count) },
        { message: localMessages.mediumLinkCount, data: formatNumber(timespan.medium_link_count) },
      ];
    }
    return (
      <StatBar
        columnWidth={3}
        stats={stats}
      />
    );
  }

}

TopicStoryStatsContainer.propTypes = {
  // from parent
  timespan: PropTypes.object,
  topicId: PropTypes.number.isRequired,
  filters: PropTypes.object.isRequired,
  // form state
  fetchData: PropTypes.func.isRequired,
  storyCount: PropTypes.number,
  // from composition chain
  intl: PropTypes.object.isRequired,
};


const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.summary.englishStoryTotals.fetchStatus,
  storyCount: state.topics.selected.summary.englishStoryTotals.counts.total,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  // can't use timespan.storyCount because there might be a query filter in place
  fetchData: (filters) => {
    dispatch(fetchTopicEnglishStoryCounts(ownProps.topicId, filters));
  },
  asyncFetch: () => {
    dispatch(fetchTopicEnglishStoryCounts(ownProps.topicId, ownProps.filters));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeAsyncContainer(
        TopicStoryStatsContainer
      )
    )
  );
