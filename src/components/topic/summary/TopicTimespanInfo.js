import React from 'react';
import { injectIntl } from 'react-intl';
import StatBar from '../../common/statbar/StatBar';

const localMessages = {
  storyLinkCount: { id: 'topic.summary.timespanInfo.storyLinkCount', defaultMessage: 'Story Links' },
  mediumCount: { id: 'topic.summary.timespanInfo.mediumCount', defaultMessage: 'Media Sources' },
  mediumLinkCount: { id: 'topic.summary.timespanInfo.mediumLinkCount', defaultMessage: 'Media Links' },
};

const TopicTimespanInfo = (props) => {
  const { timespan } = props;
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
      ]}
    />
  );
};

TopicTimespanInfo.propTypes = {
  timespan: React.PropTypes.object,
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(TopicTimespanInfo);
