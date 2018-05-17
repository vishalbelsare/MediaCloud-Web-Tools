import React from 'react';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { WarningNotice } from '../common/Notice';

const localMessages = {
  title: { id: 'errors.storySwitchover.title', defaultMessage: 'Update for Story-Level Searches' },
  intro: { id: 'errors.storySwitchover.intro', defaultMessage: '<b>Your topic query needs to be checked because we have switched to story-level searches.</b>' },
  details: { id: 'errors.storySwitchover.details', defaultMessage: 'When you last ran your topic we searched at the sentence level. Since then we have switched over to do everything at the story level, because that is what most people tell us they want. This also helps us save space and make things faster (<a target="_new" href="https://mediacloud.org/news/2018/4/12/switching-to-story-based-searching-on-may-12th">learn more about this change</a>). If your seed query relied on finding multiple words in the same sentence you need to update it.' },
};

const UpdateForStorySearchWarning = () => (
  <div className="story-switchover">
    <WarningNotice>
      <p className="title"><FormattedMessage {...localMessages.title} /></p>
      <p><FormattedHTMLMessage {...localMessages.intro} /></p>
      <p><FormattedHTMLMessage {...localMessages.details} /></p>
    </WarningNotice>
  </div>
);

export default UpdateForStorySearchWarning;
