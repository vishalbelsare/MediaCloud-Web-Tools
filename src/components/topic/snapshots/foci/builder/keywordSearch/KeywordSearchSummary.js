import React from 'react';
import { FormattedHTMLMessage, injectIntl } from 'react-intl';

const localMessages = {
  keywords: { id: 'focus.create.confirm.booleanQuery.keywords', defaultMessage: '<b>Keywords</b>: {keywords}' },
};

const KeywordSearchSummary = (props) => {
  const { properties } = props;
  return (
    <div className="focus-create-cofirm-boolean-query">
      <ul>
        <li><FormattedHTMLMessage {...localMessages.keywords} values={{ keywords: properties.keywords }} /></li>
      </ul>
    </div>
  );
};

KeywordSearchSummary.propTypes = {
  // from parent
  topicId: React.PropTypes.number.isRequired,
  properties: React.PropTypes.object.isRequired,
  // form context
  intl: React.PropTypes.object.isRequired,
};

export default
  injectIntl(
    KeywordSearchSummary
  );