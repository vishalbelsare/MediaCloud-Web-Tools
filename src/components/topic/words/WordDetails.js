import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import DataCard from '../../common/DataCard';

const localMessages = {
  title: { id: 'words.title', defaultMessage: 'About' },
  info: { id: 'words.info',
    defaultMessage: 'The term "{term}" is a version of the stem "{stem}".',
  },
};

const WordDetails = (props) => {
  const { term, stem } = props;
  return (
    <DataCard>
      <h2><FormattedMessage {...localMessages.title} /></h2>
      <p><FormattedMessage {...localMessages.info} values={{ term, stem }} /></p>
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
