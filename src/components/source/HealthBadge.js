import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';

const localMessages = {
  healthy: { id: 'source.basicInfo.healthy', defaultMessage: 'healthy' },
  notHealthy: { id: 'source.basicInfo.notHealthy', defaultMessage: 'not healthy' },
};

const HealthBadge = props => (
  <div className={`health-badge ${props.isHealthy ? 'healthy' : 'not-healthy'}`}>
    <p><FormattedMessage {...(props.isHealthy ? localMessages.healthy : localMessages.notHealthy)} /></p>
  </div>
);

HealthBadge.propTypes = {
  // from parent
  isHealthy: React.PropTypes.bool.isRequired,
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(HealthBadge);
