import React from 'react';
import { FormattedNumber, FormattedMessage, injectIntl } from 'react-intl';

const localMessages = {
  unknown: { id: 'unknown', defaultMessage: '?' },
};

const SafelyFormattedNumber = (props) => {
  if ((props.value === undefined) || (props.value === null)) {
    return <FormattedMessage {...localMessages.unknown} />;
  }
  return <FormattedNumber value={props.value} />;
};

SafelyFormattedNumber.propTypes = {
  value: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
  ]),
};

export default
  injectIntl(
    SafelyFormattedNumber
  );
