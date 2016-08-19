import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import DataCard from '../../common/DataCard';

const localMessages = {
  title: { id: 'collection.basicInfo.title', defaultMessage: 'Basic Info' },
  noHealth: { id: 'collection.basicInfo.noHealth', defaultMessage: 'Sorry, we can\'t show collection-level health yet.' },
};

const CollectionBasicInfo = (props) => {
  const { collection } = props;
  return (
    <DataCard className="source-basic-info">
      <h2><FormattedMessage {...localMessages.title} /></h2>
      <p>{collection.description}</p>
      <p><FormattedMessage {...localMessages.noHealth} /></p>
    </DataCard>
  );
};

CollectionBasicInfo.propTypes = {
  collection: React.PropTypes.object.isRequired,
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(CollectionBasicInfo);
