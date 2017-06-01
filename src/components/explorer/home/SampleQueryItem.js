import React from 'react';
import { injectIntl } from 'react-intl';
import Link from 'react-router/lib/Link';

const SampleQueryItem = (props) => {
  const { query } = props;
  return (
    <div className="featured-query">
      <h2>{query.label}</h2>
      <Link to={`/queryBuilder/?query=${query.queryParams}`}>{query.label}</Link>
    </div>
  );
};

SampleQueryItem.propTypes = {
  // from parent
  query: React.PropTypes.object,
  // from composition
  intl: React.PropTypes.object.isRequired,
};


export default
  injectIntl(
    SampleQueryItem
  );
