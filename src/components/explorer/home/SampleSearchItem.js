import React from 'react';
import { injectIntl } from 'react-intl';
import Link from 'react-router/lib/Link';
import { getUserRoles, hasPermissions, PERMISSION_LOGGED_IN } from '../../../lib/auth';
import { getPastTwoWeeksDateRange } from '../../../lib/dateUtil';

const SampleSearchItem = (props) => {
  const { search, user } = props;
  // dissect the search and put it into the url if logged in...
  // else just put in the id...
  const isNotLoggedInUser = !(hasPermissions(getUserRoles(user), PERMISSION_LOGGED_IN));
  let urlParamString = null;
  if (isNotLoggedInUser) {
    urlParamString = `demo/${search.id}`;
  } else { // TODO is this right to put into url, and what format?
    // use default dates, collection, sources
    const dateObj = getPastTwoWeeksDateRange();
    const collection = '[8875027]';
    const sources = '[1234,56789]';
    urlParamString = search.data.map(query => `search/[{"index":${query.id},"q":${query.q},"start_date":${dateObj.start},"end_date":${dateObj.end},"sources":${sources},"collections":${collection}`);
  }

  return (
    <div className="sample-query-item">
      <h2>{search.label}</h2>
      <Link to={`/queries/${urlParamString}`}>{search.label}</Link>
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
