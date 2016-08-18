import React from 'react';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';
import DataCard from '../../common/DataCard';

const localMessages = {
  sourceBasicInfoTitle: { id: 'source.basicInfo.title', defaultMessage: 'Basic Info' },
  thisSourceIs: { id: 'source.basicInfo.thisInfoIs', defaultMessage: 'This source is ' },
  healthy: { id: 'source.basicInfo.healthy', defaultMessage: 'healthy' },
  notHealthy: { id: 'source.basicInfo.notHealthy', defaultMessage: 'not healthy' },
  feedInfo: { id: 'source.basicInfo.feeds',
    defaultMessage: 'Content from {feedCount, plural,\n =0 {no RSS feeds}\n =1 {one RSS feed}\n =100 {over 100 RSS feeds}\n other {# RSS feeds}}.' },
  dateInfo: { id: 'source.basicInfo.dates', defaultMessage: 'We have collected sentences between {startDate} and {endDate}.' },
  contentInfo: { id: 'source.basicInfo.content', defaultMessage: 'Averaging {storyCount} stories per day and {sentenceCount} sentences in the last week.' },
  gapInfo: { id: 'source.basicInfo.gaps', defaultMessage: 'We\'d guess there are {gapCount} "gaps" in our coverage (highlighted in <b><span class="health-gap">in red</span></b> on the chart), compared to the highest weekly levels we\'ve seen.' },
};

const SourceBasicInfo = (props) => {
  const { source } = props;
  const { formatNumber } = props.intl;
  let healthMessage = null;
  if (source.health.is_healthy === 1) {
    healthMessage = <span className="healthy"><FormattedMessage {...localMessages.healthy} /></span>;
  } else {
    healthMessage = <span className="unhealthy"><FormattedMessage {...localMessages.notHealthy} /></span>;
  }
  return (
    <DataCard className="source-basic-info">
      <h2><FormattedMessage {...localMessages.sourceBasicInfoTitle} /></h2>
      <p><FormattedMessage {...localMessages.thisSourceIs} /> <b>{healthMessage}</b>.</p>
      <ul>
        <li><FormattedMessage {...localMessages.feedInfo} values={{ feedCount: source.feedCount }} /></li>
        <li>
          <FormattedMessage
            {...localMessages.dateInfo}
            values={{
              startDate: source.health.start_date.substring(0, 10),
              endDate: source.health.end_date.substring(0, 10),
            }}
          />
        </li>
        <li>
          <FormattedMessage
            {...localMessages.contentInfo}
            values={{
              storyCount: formatNumber(source.health.num_stories_w),
              sentenceCount: formatNumber(source.health.num_sentences_w),
            }}
          />
        </li>
        <li>
          <FormattedHTMLMessage
            {...localMessages.gapInfo}
            values={{ gapCount: formatNumber(source.health.coverage_gaps) }}
          />
        </li>
      </ul>
    </DataCard>
  );
};

SourceBasicInfo.propTypes = {
  source: React.PropTypes.object.isRequired,
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(SourceBasicInfo);
