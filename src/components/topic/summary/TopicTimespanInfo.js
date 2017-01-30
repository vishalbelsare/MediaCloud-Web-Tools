import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../common/AsyncContainer';
import { fetchTopicGeocodedStoryCounts, fetchTopicEnglishStoryCounts } from '../../../actions/topicActions';
import StatBar from '../../common/statbar/StatBar';

const localMessages = {
  storyLinkCount: { id: 'topic.summary.timespanInfo.storyLinkCount', defaultMessage: 'Story Links' },
  mediumCount: { id: 'topic.summary.timespanInfo.mediumCount', defaultMessage: 'Media Sources' },
  mediumLinkCount: { id: 'topic.summary.timespanInfo.mediumLinkCount', defaultMessage: 'Media Links' },
  geocodedCount: { id: 'topic.summary.timespanInfo.geocodedCount', defaultMessage: 'Geocoded Stories' },
  englishCount: { id: 'topic.summary.timespanInfo.englishCount', defaultMessage: 'English Stories' },
  storyCount: { id: 'topic.summary.timespanInfo.storyCount', defaultMessage: 'Total Stories' },
};

const TopicTimespanInfo = (props) => {
  const { timespan, geocodedCounts, englishCounts } = props;
  const { formatNumber } = props.intl;
  if ((timespan === null) || (timespan === undefined)) {
    return null;
  }
  return (
    <StatBar
      stats={[
        { message: localMessages.mediumCount, data: formatNumber(timespan.medium_count) },
        { message: localMessages.mediumLinkCount, data: formatNumber(timespan.medium_link_count) },
        { message: localMessages.storyLinkCount, data: formatNumber(timespan.story_link_count) },
        { message: localMessages.geocodedCount,
          data: formatNumber(geocodedCounts.count / geocodedCounts.total, { style: 'percent' }) },
        { message: localMessages.englishCount,
          data: formatNumber(englishCounts.count / geocodedCounts.total, { style: 'percent' }) },
        { message: localMessages.storyCount, data: formatNumber(timespan.story_count) },
      ]}
    />
  );
};

TopicTimespanInfo.propTypes = {
  // from parent
  timespan: React.PropTypes.object,
  topicId: React.PropTypes.number.isRequired,
  filters: React.PropTypes.object.isRequired,
  // from composition chain
  intl: React.PropTypes.object.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  geocodedCounts: React.PropTypes.object,
  englishCounts: React.PropTypes.object,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.summary.geocodedStoryTotals.fetchStatus,  // TODO: respect both statuses
  geocodedCounts: state.topics.selected.summary.geocodedStoryTotals.counts,
  englishCounts: state.topics.selected.summary.englishStoryTotals.counts,
  filters: state.topics.selected.filters,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  asyncFetch: () => {
    dispatch(fetchTopicGeocodedStoryCounts(ownProps.topicId, ownProps.filters));
    dispatch(fetchTopicEnglishStoryCounts(ownProps.topicId, ownProps.filters));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeAsyncContainer(
        TopicTimespanInfo
      )
    )
  );
