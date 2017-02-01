import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import Link from 'react-router/lib/Link';
import OrderedWordCloud from '../../vis/OrderedWordCloud';
import CollectionIcon from '../../common/icons/CollectionIcon';

const localMessages = {
  collectionTitle: { id: 'collection.featured.title', defaultMessage: 'Collection: ' },

};

const FeaturedItem = (props) => {
  const { collection } = props;
  return (
    <div>
      <h3><CollectionIcon height={25} /><FormattedMessage {...localMessages.collectionTitle} /><Link to={`/collections/${collection.id}/summary`}>{collection.label}</Link></h3>
      <h4>{collection.description}</h4>
      <OrderedWordCloud words={collection.wordcount} />
    </div>
  );
};

FeaturedItem.propTypes = {
  // from parent
  collection: React.PropTypes.object,
  // from composition
  intl: React.PropTypes.object.isRequired,
};


export default
  injectIntl(
    FeaturedItem
  );
