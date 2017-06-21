import React from 'react';
import { injectIntl } from 'react-intl';
import Link from 'react-router/lib/Link';
import { getUserRoles, hasPermissions, PERMISSION_LOGGED_IN } from '../../../lib/auth';

const SampleSearchItem = (props) => {
  const { search, user } = props;
  // dissect the search and put it into the url if logged in...
  // else just put in the id...
  const isNotLoggedInUser = !(hasPermissions(getUserRoles(user), PERMISSION_LOGGED_IN));
  let urlParamString = null;
  if (isNotLoggedInUser) {
    urlParamString = `searchId=${search.id}`;
  } else { // TODO is this right to put into url, and what format?
    urlParamString = search.data.map(query => `id=${query.id}&q=${query.q}&start_date=${query.start_date}&end_date=${query.end_date}`);
  }

  return (
    <div className="sample-query-item">
      <h2>{search.label}</h2>
      <Link to={`/queryBuilder/?${urlParamString}`}>{search.label}</Link>
    </div>
  );
};

SampleSearchItem.propTypes = {
  // from parent
  search: React.PropTypes.object,
  // from composition
  intl: React.PropTypes.object.isRequired,
  user: React.PropTypes.object,
};


export default
  injectIntl(
    SampleSearchItem
  );
