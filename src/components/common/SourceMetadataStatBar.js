import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import messages from '../../resources/messages';
import StatBar from '../common/statbar/StatBar';

const localMessages = {
  pubCountry: { id: 'source.pubCountry', defaultMessage: 'Publication Country' },
  pubState: { id: 'source.pubState', defaultMessage: 'Publication State' },
  mediaType: { id: 'source.pubState', defaultMessage: 'Media Type' },
  primaryLanguage: { id: 'source.primaryLanguage', defaultMessage: 'Primary Language' },
  countryOfFocus: { id: 'source.countryOfFocus', defaultMessage: 'Country of Focus' },
  languageHelpContent: { id: 'source.details.language.help.content', defaultMessage: '<p>We automatically guess the langauge of stories in our system. This language is the one most used by this source based on the automatic detection.</p>' },
  geoHelpDetailedContent: { id: 'source.details.geo.title', defaultMessage: '<p>This is the country this source writes about most.</p>' },
};

/**
 * This requies `tagUtil.mediaSourceMetadataProps(source)` to have been called in the reducer to fill
 * in the named metadata properties on the source object.
 **/
const SourceMetadataStatBar = (props) => {
  const { columnWidth, source } = props;
  if (source && source.metadata) {
    return (
      <div className="source-metadata-stat-bar">
        <StatBar
          columnWidth={columnWidth || 3}
          stats={[
            { message: localMessages.pubCountry, data: source.metadata.pub_country ? source.metadata.pub_country.label : '?' },
            { message: localMessages.pubState, data: source.metadata.pub_state ? source.metadata.pub_state.label : '?' },
            { message: localMessages.primaryLanguage,
              data: source.language ? source.metadata.language.label : '?',
              helpTitleMsg: localMessages.primaryLanguage,
              helpContentMsg: localMessages.languageHelpContent,
            },
            { message: localMessages.countryOfFocus,
              data: source.metadata.about_country ? source.metadata.about_country.label : '?',
              helpTitleMsg: messages.entityHelpTitle,
              helpContentMsg: [localMessages.geoHelpDetailedContent, messages.entityHelpContent],
            },
            { message: localMessages.mediaType,
              data: source.metadata.media_type ? source.metadata.media_type.label : '?',
              helpTitleMsg: messages.mediaTypeHelpTitle,
              helpContentMsg: messages.mediaTypeHelpContent,
            },
          ]}
        />
      </div>
    );
  }
  return <div />;
};

SourceMetadataStatBar.propTypes = {
  // from parent
  source: PropTypes.object.isRequired,
  columnWidth: PropTypes.number,  // optional override - defaults to 3 so it looks good in a 12 wide container
  // from context
  intl: PropTypes.object.isRequired,
};

export default
  injectIntl(
    SourceMetadataStatBar
  );
