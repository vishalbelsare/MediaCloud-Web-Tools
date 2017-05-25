import React from 'react';
import { injectIntl } from 'react-intl';
import Link from 'react-router/lib/Link';

const FeaturedItem = (props) => {
  const { query } = props;
  return (
    <div className="featured-query">
      <h2>Featured Query</h2>
      <Link to={`/queryBuilder/${query.id}`}>{query.label}</Link>
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
