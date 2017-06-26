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
  let display = null;
  if (isNotLoggedInUser) {
    urlParamString = `demo/${search.id}`;
    display = search.queries.map(q => q.label).join(',');
  } else { // TODO is this right to put into url, and what format?
    // use default dates, collection, sources
    const dateObj = getPastTwoWeeksDateRange();
    const collection = '[8875027]';
    const sources = '[]';
    urlParamString = search.queries.map(query => `search/[{"index":${query.index},"q":${query.q},"startDate":${dateObj.start},"endDate":${dateObj.end},"sources":${sources},"collections":${collection}`);
    display = search.queries.map(q => q.label).join(',');
  }

  return (
    <div className="sample-query-item">
      <h2>{search.name}</h2>
      <Link to={`/queries/${urlParamString}`}>{display}</Link>
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
