import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import OrderedWordCloud from '../../vis/OrderedWordCloud';
import CollectionIcon from '../../common/icons/CollectionIcon';

const localMessages = {
  collectionTitle: { id: 'collection.featured.title', defaultMessage: 'Collection: {name}' },

};

const FeaturedItem = (props) => {
  const { collection } = props;
  return (
    <div>
      <CollectionIcon height={25} />
      <h3><FormattedMessage {...localMessages.collectionTitle} values={{ name: collection.label }} /></h3>
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
