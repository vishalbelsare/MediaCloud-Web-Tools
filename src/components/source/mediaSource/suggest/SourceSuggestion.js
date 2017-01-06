import React from 'react';
import { FormattedMessage, FormattedDate, injectIntl } from 'react-intl';
import DataCard from '../../../common/DataCard';

const localMessages = {
  info: { id: 'source.suggestion.info', defaultMessage: 'Suggested as "{name}" by {user} on {date} because "{reason}".' },
  markSummary: { id: 'source.suggestion.markSummary', defaultMessage: 'Marked as {status} by {user} on {date} because {reason}.' },
  notMarked: { id: 'source.suggestion.notMarked', defaultMessage: 'Not reviwed yet.' },
};

const SourceSuggestion = (props) => {
  const { suggestion } = props;
  const { formatDate } = props.intl;
  let reviewContent = null;
  if (suggestion.mark_auth_users_id) {
    reviewContent = (
      <p>
        <FormattedMessage
          {...localMessages.markSummary}
          values={{
            status: suggestion.status,
            user: suggestion.mark_auth_users_id,
            reason: suggestion.mark_reason,
            date: formatDate(suggestion.date_marked),
          }}
        />
      </p>
    );
  } else {
    reviewContent = (<p><FormattedMessage {...localMessages.notMarked} /></p>);
  }
  return (
    <DataCard className={`source-suggestion source-suggestion-${suggestion.status}`}>
      <h2>{suggestion.url}</h2>
      <p>
        <b>{suggestion.status}</b>
        &nbsp;
        <small><FormattedDate value={suggestion.date_marked} /></small>
      </p>
      <p>
        <FormattedMessage
          {...localMessages.info}
          values={{
            name: suggestion.name,
            user: suggestion.auth_users_id,
            date: formatDate(suggestion.date_submitted),
            reason: suggestion.reason,
          }}
        />
      </p>
      {reviewContent}
    </DataCard>
  );
};


SourceSuggestion.propTypes = {
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
  // from parent
  suggestion: React.PropTypes.object.isRequired,
  markable: React.PropTypes.bool.isRequired,
};

export default
  injectIntl(
    SourceSuggestion
  );
