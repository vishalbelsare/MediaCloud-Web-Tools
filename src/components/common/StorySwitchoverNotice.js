import React from 'react';
import { FormattedMessage } from 'react-intl';
import { WarningNotice } from './Notice';

const localMessages = {
  title: { id: 'errors.storySwitchover.title', defaultMessage: 'Migrating to Story-Level Searches' },
  details: { id: 'errors.storySwitchover.details', defaultMessage: 'We currently do most analysis and searching at the sentence level. We\'re switching to do everything at the story level on May 12, because that is what most people tell use they want. This will also help us save space and make things faster. This is a big change.  Your current queries and topics will need to be updated after May 12 and will produce different results.' },
  learnMore: { id: 'errors.storySwitchover.learnMore', defaultMessage: 'Learn more on our blog post about this.' },
};

const StorySwitchoverNotice = () => (
  <div className="story-switchover">
    <WarningNotice>
      <p className="title"><FormattedMessage {...localMessages.title} /></p>
      <p><FormattedMessage {...localMessages.details} />
        <br /><a href="https://mediacloud.org/news/2018/4/12/switching-to-story-based-searching-on-may-12th"><FormattedMessage {...localMessages.learnMore} /></a>
      </p>
    </WarningNotice>
  </div>
);

export default StorySwitchoverNotice;
