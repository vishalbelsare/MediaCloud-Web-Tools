import React from 'react';
import { injectIntl } from 'react-intl';
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
  const { timespan } = props;
  const { formatNumber } = props.intl;
  if ((timespan === null) || (timespan === undefined)) {
    return null;
  }
  return (
    <StatBar
      columnWidth={3}
      stats={[
        { message: localMessages.storyCount, data: formatNumber(timespan.story_count) },
        { message: localMessages.mediumCount, data: formatNumber(timespan.medium_count) },
        { message: localMessages.storyLinkCount, data: formatNumber(timespan.story_link_count) },
        { message: localMessages.mediumLinkCount, data: formatNumber(timespan.medium_link_count) },
      ]}
    />
  );
};

TopicTimespanInfo.propTypes = {
  // from parent
  timespan: React.PropTypes.object,
  topicId: React.PropTypes.number.isRequired,
  // from composition chain
  intl: React.PropTypes.object.isRequired,
};

export default
  injectIntl(
    TopicTimespanInfo
  );
