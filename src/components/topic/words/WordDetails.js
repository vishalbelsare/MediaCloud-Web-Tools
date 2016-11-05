import React from 'react';
import { injectIntl } from 'react-intl';
import DataCard from '../../common/DataCard';

const localMessages = {
  info: { id: 'words.info',
    defaultMessage: 'The term {term} has the root word of {stem}',
  },
};

const WordDetails = (props) => {
  const { formatMessage } = props.intl;
  let messageTxt = '';
  messageTxt = formatMessage(localMessages.info, {
    term: props.term,
    stem: props.stem,
  });
  return (
    <DataCard>
      <h2>
        { messageTxt }
      </h2>
    </DataCard>
  );
};

WordDetails.propTypes = {
  // from parent
  term: React.PropTypes.string.isRequired,
  stem: React.PropTypes.string.isRequired,
  // from context
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(WordDetails);
