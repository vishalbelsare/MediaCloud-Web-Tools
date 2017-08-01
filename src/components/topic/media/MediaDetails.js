import React from 'react';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';
import DataCard from '../../common/DataCard';

const localMessages = {
  title: { id: 'media.details.title',
    defaultMessage: 'Basic Info',
  },
  summary: { id: 'media.details.summary',
    defaultMessage: 'Visit this media source at <a href="{mediaUrl}">{mediaUrl}</a>.' },
  publishedBy: { id: 'media.details.publishedBy', defaultMessage: 'It was published by ' },
  otherInfo: { id: 'media.details.otherInfo', defaultMessage: ' Some other information:' },
  socialData: { id: 'media.details.socialData', defaultMessage: 'Social Data:' },
  bitlyClicks: { id: 'media.details.bitlyClicks',
    defaultMessage: '{count, plural,\n  =0 {no Bit.ly clicks}\n  =1 {one Bit.ly click}\n  other {# Bit.ly clicks}}' },
  facebookShares: { id: 'media.details.facebookShares',
    defaultMessage: '{count, plural,\n  =0 {no Facebook shares}\n  =1 {one Facebook share}\n  other {# Facebook shares}}' },
  inlinkCount: { id: 'media.details.inlinkCount',
    defaultMessage: '{count, plural,\n  =0 {No stories in other media sources}\n  =1 {One story in another media source}\n  other {# stories in other media sources}} link to a story in this media source.' },
  mediaInlinkCount: { id: 'media.details.mediaInlinkCount',
    defaultMessage: '{count, plural,\n  =0 {No other media sources have}\n  =1 {One other media source has}\n  other {# other media sources have}} have  at least one story that links to at least one story in this media source.' },
  outlinkCount: { id: 'media.details.outlinkCount',
    defaultMessage: '{count, plural,\n  =0 {No links}\n  =1 {One link}\n  other {# links}} to stories in other media sources.' },
  storyCount: { id: 'media.details.storyCount',
    defaultMessage: '{count, plural,\n  =0 {No stories}\n  =1 {One story}\n  other {# stories}} in this Topic during this timespan.' },
};

const MediaDetails = (props) => {
  const { media } = props;
  return (
    <DataCard>
      <h2><FormattedMessage {...localMessages.title} /></h2>
      <p>
        <FormattedHTMLMessage
          {...localMessages.summary}
          values={{ mediaUrl: media.url }}
        />
        <FormattedMessage{...localMessages.otherInfo} />
      </p>
      <ul>
        <li>
          <FormattedMessage
            {...localMessages.storyCount}
            values={{ count: media.story_count }}
          />
        </li>
        <li>
          <FormattedMessage
            {...localMessages.bitlyClicks}
            values={{ count: media.bitly_click_count }}
          />
        </li>
        <li>
          <FormattedMessage
            {...localMessages.facebookShares}
            values={{ count: media.facebook_share_count }}
          />
        </li>
        <li>
          <FormattedMessage
            {...localMessages.inlinkCount}
            values={{ count: media.inlink_count }}
          />
        </li>
        <li>
          <FormattedMessage
            {...localMessages.mediaInlinkCount}
            values={{ count: media.media_inlink_count }}
          />
        </li>
        <li>
          <FormattedMessage
            {...localMessages.outlinkCount}
            values={{ count: media.outlink_count }}
          />
        </li>
      </ul>
    </DataCard>
  );
};

MediaDetails.propTypes = {
  // from parent
  media: React.PropTypes.object.isRequired,
  // from context
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(MediaDetails);
