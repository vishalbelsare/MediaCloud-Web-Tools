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
  } else {
    // use default dates, collection, sources. The logged in user can change in url or in the querybuilder
    const dateObj = getPastTwoWeeksDateRange();
    const collection = search.queries.map(query => query.collections.map(c => `[{"id":${c.id}}]`));
    // const sources = '[]'; we default to empty sources for searches from this page so we don't need to do any prep like we do in the query builder

    urlParamString = search.queries.map((query, idx) => `{"index":${query.index},"q":"${query.q}","startDate":"${dateObj.start}","endDate":"${dateObj.end}","sources":[],"collections":${collection[idx].join()}}`);
    urlParamString = `search/[${urlParamString}]`;
  }
  const link = `/queries/${urlParamString}`;
  return (
    <div className="sample-search-item">
      <h2><Link to={link}>{search.name}</Link></h2>
      <Link to={link}><img src={`/static/img/sample-searches/${search.imageName}`} alt={search.name} /></Link>
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
