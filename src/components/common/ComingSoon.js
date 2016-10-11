import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

const localMessages = {
  comingSoon: { id: 'comingSoon', defaultMessage: 'Coming Soon' },
};

const ComingSoon = () => (
  <div className="coming-soon">
    <p>( <FormattedMessage {...localMessages.comingSoon} /> )</p>
  </div>
);

ComingSoon.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
};

export default
  injectIntl(
    ComingSoon
  );
