import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

/**
 * The primary unit of our interface. Any self-contained piece of a larger report page should
 * be inside of a DataCard.
 */
const ToolDescription = (props) => {
  const { name, description, screenshotUrl, url, className } = props;
  return (
    <div className={`tool-description ${className}`} onTouchTap={() => { window.location = url; }}>
      <h2><FormattedMessage {...name} /></h2>
      <p><FormattedMessage {...description} /></p>
      <img src={screenshotUrl} alt={<FormattedMessage {...name} />} width="100%" />
    </div>
  );
};

ToolDescription.propTypes = {
  // from composition chain
  intl: React.PropTypes.object.isRequired,
  // from parent
  name: React.PropTypes.object.isRequired,
  description: React.PropTypes.object.isRequired,
  screenshotUrl: React.PropTypes.string.isRequired,
  className: React.PropTypes.string.isRequired,
  url: React.PropTypes.string.isRequired,
};

export default
  injectIntl(
    ToolDescription
  );
