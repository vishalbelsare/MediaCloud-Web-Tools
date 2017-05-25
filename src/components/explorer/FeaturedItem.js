import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import Link from 'react-router/lib/Link';

const localMessages = {
  collectionTitle: { id: 'collection.featured.title', defaultMessage: 'Collection: ' },
};

const FeaturedItem = () => {
  return (
    <div className="featured-query">
      <h2>Featured Query</h2>
      <Link to={`/queryBuilder/${query.id}`}>{query.label}</Link></h2>
    </div>
  );
};

FeaturedItem.propTypes = {
  // from parent
  query: React.PropTypes.object,
  // from composition
  intl: React.PropTypes.object.isRequired,
};


export default
  injectIntl(
    FeaturedItem
  );
