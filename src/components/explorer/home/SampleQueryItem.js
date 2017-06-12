import React from 'react';
import { injectIntl } from 'react-intl';
import Link from 'react-router/lib/Link';

const SampleQueryItem = (props) => {
  const { query } = props;
  // TODO change this for non-logged in user - pass the id, not the query info
  return (
    <div className="featured-query">
      <h2>{query.label}</h2>
      <Link to={`/queryBuilder/?q=${query.q}&start_date=${query.start_date}&end_date=${query.end_date}`}>{query.label}</Link>
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
