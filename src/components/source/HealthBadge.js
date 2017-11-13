import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import messages from '../../resources/messages';

const localMessages = {
  healthy: { id: 'source.basicInfo.healthy', defaultMessage: 'healthy' },
  notHealthy: { id: 'source.basicInfo.notHealthy', defaultMessage: 'not healthy' },
};

const HealthBadge = (props) => {
  let content;
  if ((props.isHealthy === undefined) || (props.isHealthy === null)) {
    content = (
      <div className="health-badge">
        <FormattedMessage {...messages.unknown} />
      </div>
    );
  } else {
    content = (
      <div className={`health-badge ${props.isHealthy ? 'healthy' : 'not-healthy'}`}>
        <p><FormattedMessage {...(props.isHealthy ? localMessages.healthy : localMessages.notHealthy)} /></p>
      </div>
    );
  }
  return content;
};

HealthBadge.propTypes = {
  // from parent
  isHealthy: PropTypes.bool,
  // from compositional chain
  intl: PropTypes.object.isRequired,
};

export default injectIntl(HealthBadge);
