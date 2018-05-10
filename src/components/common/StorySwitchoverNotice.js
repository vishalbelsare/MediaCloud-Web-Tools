import React from 'react';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { WarningNotice } from './Notice';

const localMessages = {
  title: { id: 'errors.storySwitchover.title', defaultMessage: 'Migrating to Story-Level Searches' },
  intro: { id: 'errors.storySwitchover.intro', defaultMessage: '<b>Your current queries and topics will need to be updated after May 12 because they will produce different results.</b>' },
  details: { id: 'errors.storySwitchover.details', defaultMessage: 'We currently do most analysis and searching at the sentence level. We\'re switching to do everything at the story level on May 12, because that is what most people tell us they want. This will also help us save space and make things faster. <a href="https://mediacloud.org/news/2018/4/12/switching-to-story-based-searching-on-may-12th" target="_new">Learn more about this change.</a>' },
};

const StorySwitchoverNotice = () => (
  <div className="story-switchover">
    <WarningNotice>
      <p className="title"><FormattedMessage {...localMessages.title} /></p>
      <p><FormattedHTMLMessage {...localMessages.intro} /></p>
      <p><FormattedHTMLMessage {...localMessages.details} /></p>
    </WarningNotice>
  </div>
);

export default StorySwitchoverNotice;
