import React from 'react';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';
import DataCard from '../../common/DataCard';
import LinkWithFilters from '../LinkWithFilters';

const localMessages = {
  title: { id: 'story.details.title',
    defaultMessage: 'Basic Info',
  },
  summary: { id: 'story.details.summary',
    defaultMessage: '<a href="{storyUrl}">Read the original story</a>. We think this story was published on {publishDate}. ' },
  publishedBy: { id: 'story.details.publishedBy', defaultMessage: 'It was published by ' },
  otherInfo: { id: 'story.details.otherInfo', defaultMessage: ' Some other information:' },
  socialData: { id: 'story.details.socialData', defaultMessage: 'Social Data:' },
  bitlyClicks: { id: 'story.details.bitlyClicks',
    defaultMessage: '{count, plural,\n  =0 {no Bit.ly clicks}\n  =1 {one Bit.ly click}\n  other {# Bit.ly clicks}}' },
  facebookShares: { id: 'story.details.facebookShares',
    defaultMessage: '{count, plural,\n  =0 {no Facebook shares}\n  =1 {one Facebook share}\n  other {# Facebook shares}}' },
  detectedLanguage: { id: 'story.details.detectedLanguage',
    defaultMessage: 'We have detected that it\'s language "{detectedLanguage}"' },
};

const StoryDetails = (props) => {
  const { topicId, story } = props;
  const { formatDate } = props.intl;
  const mediaLink = (
    <span>
      <FormattedMessage {...localMessages.publishedBy} />
      <LinkWithFilters to={`/topics/${topicId}/media/${story.media_id}`}>
        {story.media_name}
      </LinkWithFilters>.
    </span>
  );
  return (
    <DataCard>
      <h2><FormattedMessage {...localMessages.title} /></h2>
      <p>
        <FormattedHTMLMessage {...localMessages.summary}
          values={ {
            publishDate: formatDate(story.publish_date,
              { year: '2-digit', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' }),
            storyUrl: story.url,
            mediaName: story.media_name,
          } }
        />
        {mediaLink}
        <FormattedMessage {...localMessages.otherInfo} />
      </p>
      <ul>
        <li>
          <FormattedMessage {...localMessages.bitlyClicks}
            values={ { count: story.bitly_click_count } }
          />
        </li>
        <li>
          <FormattedMessage {...localMessages.facebookShares}
            values={ { count: story.facebook_share_count } }
          />
        </li>
        <li>
          <FormattedMessage {...localMessages.detectedLanguage}
            values={ { detectedLanguage: story.language } }
          />
        </li>
      </ul>
    </DataCard>
  );
};

StoryDetails.propTypes = {
  // from parent
  topicId: React.PropTypes.number.isRequired,
  story: React.PropTypes.object.isRequired,
  // from context
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(StoryDetails);
