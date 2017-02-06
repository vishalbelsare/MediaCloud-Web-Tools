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
    <div className="featured-collection">
      <h2><CollectionIcon height={25} /><FormattedMessage {...localMessages.collectionTitle} /><Link to={`/collections/${collection.id}`}>{collection.label}</Link></h2>
      <p><b>{collection.description}</b></p>
      <OrderedWordCloud
        words={collection.wordcount}
        maxFontSize={16}
        minfontSize={5}
        width={600}
        height={200}
      />
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
