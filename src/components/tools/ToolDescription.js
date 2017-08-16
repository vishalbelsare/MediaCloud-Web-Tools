import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

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
  intl: PropTypes.object.isRequired,
  // from parent
  name: PropTypes.object.isRequired,
  description: PropTypes.object.isRequired,
  screenshotUrl: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

export default
  injectIntl(
    ToolDescription
  );
