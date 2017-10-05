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
  geoHelpDetailedContent: { id: 'source.details.geo.title', defaultMessage: '<p>This is the country this source writes about most.  We automatically detect the countries and states talked about in our content.</p>' },
};

/**
 * This requies `tagUtil.mediaSourceMetadataProps(source)` to have been called in the reducer to fill
 * in the named metadata properties on the source object.
 **/
const SourceMetadataStatBar = (props) => {
  const { columnWidth, source } = props;
  return (
    <div className="source-metadata-stat-bar">
      <StatBar
        columnWidth={columnWidth || 3}
        stats={[
          { message: localMessages.pubCountry, data: source.pubCountryTag ? source.pubCountryTag.label : '?' },
          { message: localMessages.pubState, data: source.pubStateTag ? source.pubStateTag.label : '?' },
          { message: localMessages.primaryLanguage,
            data: source.primaryLangaugeTag ? source.primaryLangaugeTag.label : '?',
            helpTitleMsg: localMessages.primaryLanguage,
            helpContentMsg: localMessages.languageHelpContent,
          },
          { message: localMessages.countryOfFocus,
            data: source.countryOfFocusTag ? source.countryOfFocusTag.label : '?',
            helpTitleMsg: messages.geoHelpTitle,
            helpContentMsg: [localMessages.geoHelpDetailedContent, messages.geoHelpContent],
          },
          { message: localMessages.mediaType, data: source.mediaTypeTag ? source.mediaTypeTag.label : '?' },
        ]}
      />
    </div>
  );
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
