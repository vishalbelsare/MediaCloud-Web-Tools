import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../common/AsyncContainer';
import { fetchTopicGeocodedStoryCoverage, fetchTopicEnglishStoryCounts, fetchTopicUndateableStoryCounts, fetchTopicNytLabelCoverage } from '../../../actions/topicActions';
import StatBar from '../../common/statbar/StatBar';
import messages from '../../../resources/messages';

const localMessages = {
  themedCount: { id: 'topic.summary.storystats.themedCount', defaultMessage: 'Stories Checked for Themes' },
  geocodedCount: { id: 'topic.summary.storystats.geocodedCount', defaultMessage: 'Geocoded Stories' },
  englishCount: { id: 'topic.summary.storystats.englishCount', defaultMessage: 'English Stories' },
  undateableCount: { id: 'topic.summary.storystats.undateableCount', defaultMessage: 'Undateable Stories' },
};

const TopicStoryStatsContainer = (props) => {
  const { timespan, themeCounts, undateableCount, geocodedCounts, englishCounts } = props;
  const { formatNumber } = props.intl;
  if ((timespan === null) || (timespan === undefined)) {
    return null;
  }
  return (
    <StatBar
      columnWidth={6}
      stats={[
        { message: localMessages.englishCount,
          data: formatNumber(englishCounts.count / geocodedCounts.total, { style: 'percent' }) },
        { message: localMessages.undateableCount,
          data: formatNumber(undateableCount.count / undateableCount.total, { style: 'percent' }) },
        { message: localMessages.geocodedCount,
          data: formatNumber(geocodedCounts.count / geocodedCounts.total, { style: 'percent' }),
          helpTitleMsg: messages.geoHelpTitle,
          helpContentMsg: messages.geoHelpContent,
        },
        { message: localMessages.themedCount,
          data: formatNumber(themeCounts.count / themeCounts.total, { style: 'percent' }),
          helpTitleMsg: messages.themeHelpTitle,
          helpContentMsg: messages.themeHelpContent,
        },
      ]}
    />
  );
};

TopicStoryStatsContainer.propTypes = {
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
  themeCounts: React.PropTypes.object,
  undateableCount: React.PropTypes.object,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.summary.geocodedStoryTotals.fetchStatus,  // TODO: respect all the statuses
  geocodedCounts: state.topics.selected.summary.geocodedStoryTotals.counts,
  englishCounts: state.topics.selected.summary.englishStoryTotals.counts,
  undateableCount: state.topics.selected.summary.undateableStoryTotals.counts,
  themeCounts: state.topics.selected.summary.themedStoryTotals.counts,
  filters: state.topics.selected.filters,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  asyncFetch: () => {
    dispatch(fetchTopicGeocodedStoryCoverage(ownProps.topicId, ownProps.filters));
    dispatch(fetchTopicEnglishStoryCounts(ownProps.topicId, ownProps.filters));
    dispatch(fetchTopicUndateableStoryCounts(ownProps.topicId, ownProps.filters));
    dispatch(fetchTopicNytLabelCoverage(ownProps.topicId, ownProps.filters));
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
