import React from 'react';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { injectIntl } from 'react-intl';
import DataCard from '../../common/DataCard';

const localMessages = {
  title: { id: 'topic.summary.timespanInfo.title',
    defaultMessage: 'Basic Stats',
  },
  summary: { id: 'topic.summary.timespanInfo.summary',
    defaultMessage: 'You are looking at an <b>{period}</b> timespan, covering stories that we think were published between {startDate} and {endDate}. It includes:' },
  storyCount: { id: 'topic.summary.timespanInfo.storyCount',
    defaultMessage: '{storyCount, plural,\n  =0 {no stories}\n  =1 {one story}\n  other {# stories}\n}' },
  storyLinkCount: { id: 'topic.summary.timespanInfo.storyLinkCount',
    defaultMessage: '{storyLinkCount, plural,\n  =0 {no links between stories}\n  =1 {one link between stories}\n  other {# links between stories}\n}' },
  mediumCount: { id: 'topic.summary.timespanInfo.mediumCount',
    defaultMessage: 'stories from {mediumCount, plural,\n  =0 {no media}\n  =1 {one media source}\n  other {# media sources}\n}' },
  mediumLinkCount: { id: 'topic.summary.timespanInfo.mediumLinkCount',
    defaultMessage: '{mediumLinkCount, plural,\n  =0 {no links between media sources}\n  =1 {one link between media sources}\n  other {# links between media sources}\n}' },
};

const TopicTimespanInfo = (props) => {
  const { timespan } = props;
  const { formatDate } = props.intl;
  if ((timespan === null) || (timespan === undefined)) {
    return <div />;
  }
  return (
    <DataCard>
      <h2>
        <FormattedMessage {...localMessages.title} />
      </h2>
      <p>
        <FormattedHTMLMessage {...localMessages.summary} values={{
          period: timespan.period,
          startDate: formatDate(timespan.startDateObj, { year: '2-digit', month: 'numeric', day: 'numeric' }),
          endDate: formatDate(timespan.endDateObj, { year: '2-digit', month: 'numeric', day: 'numeric' }),
        }}
        />
      </p>
      <ul>
        <li><FormattedHTMLMessage {...localMessages.storyCount} values={{ storyCount: timespan.story_count }} /></li>
        <li><FormattedHTMLMessage {...localMessages.storyLinkCount} values={{ storyLinkCount: timespan.story_link_count }} /></li>
        <li><FormattedHTMLMessage {...localMessages.mediumCount} values={{ mediumCount: timespan.medium_count }} /></li>
        <li><FormattedHTMLMessage {...localMessages.mediumLinkCount} values={{ mediumLinkCount: timespan.medium_link_count }} /></li>
      </ul>
    </DataCard>
  );
};

TopicTimespanInfo.propTypes = {
  timespan: React.PropTypes.object,
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(TopicTimespanInfo);
