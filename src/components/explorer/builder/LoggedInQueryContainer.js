import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import * as d3 from 'd3';
import { selectQuery, selectBySearchId, selectBySearchParams, fetchSampleSearches, fetchQuerySourcesByIds, fetchQueryCollectionsByIds, resetSelected, resetQueries, resetSentenceCounts, resetSamples, resetStoryCounts, resetGeo } from '../../../actions/explorerActions';

import QueryBuilderContainer from './QueryBuilderContainer';
import QueryResultsContainer from './QueryResultsContainer';
// import { notEmptyString } from '../../../lib/formValidators';
import { getUserRoles, hasPermissions, PERMISSION_LOGGED_IN } from '../../../lib/auth';
import { getPastTwoWeeksDateRange } from '../../../lib/dateUtil';
import { DEFAULT_COLLECTION, DEFAULT_COLLECTION_OBJECT } from '../../../lib/explorerUtil';

/* const localMessages = {
  querySearch: { id: 'explorer.queryBuilder.advanced', defaultMessage: 'Search For' },
  searchHint: { id: 'explorer.queryBuilder.hint', defaultMessage: 'Search for ' },
}; */

const MAX_COLORS = 20;

class LoggedInQueryContainer extends React.Component {
  componentWillMount() {
    const { user, selected } = this.props;
    if (hasPermissions(getUserRoles(user), PERMISSION_LOGGED_IN)) {
      if (!selected) {
        this.checkPropsAndDispatch(this.props);
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    this.checkPropsAndDispatch(nextProps);
  }
  componentWillUnmount() {
    const { resetExplorerData } = this.props;
    resetExplorerData();
  }
  checkPropsAndDispatch(whichProps) {
    const { user, samples, selected, selectSearchQueriesById, selectQueriesByURLParams, setSelectedQuery, loadSampleSearches } = this.props;
    const url = whichProps.location.pathname;
    let currentIndexOrQuery = url.slice(url.lastIndexOf('/') + 1, url.length);

    if (hasPermissions(getUserRoles(user), PERMISSION_LOGGED_IN)) {
      if (whichProps.location.pathname.includes('/queries/search')) {
        // parse query params
        // for demo mode, whatever the user enters in the homepage field is interpreted only as a keyword(s)
        const parsedObjectArray = this.parseJSONParams(currentIndexOrQuery);
        /* const currentQuery = parsedObjectArray.map(q => q.q);
         let isNewQuerySet = null;
        if (whichProps && whichProps.selected) {
          isNewQuerySet = (currentQuery.findIndex(q => q.includes(whichProps.selected.q)) < 0); // this is true even if a new query is beign entered
        } */
        if (this.props.location.pathname !== whichProps.location.pathname) {
          // TODO how to keep current selection if this is just an *updated* set of queries
          selectQueriesByURLParams(parsedObjectArray);
          setSelectedQuery(parsedObjectArray[0]);
        } else if (!selected && !whichProps.selected) {
          selectQueriesByURLParams(parsedObjectArray);
          setSelectedQuery(parsedObjectArray[0]);
        }
      } else if (whichProps.location.pathname.includes('/queries')) {
        currentIndexOrQuery = parseInt(currentIndexOrQuery, 10);

        if (!samples || samples.length === 0) { // if not loaded as in bookmarked page
          loadSampleSearches(currentIndexOrQuery); // currentIndex
        } else if ((!selected && !whichProps.selected) || (whichProps.selected && whichProps.selected.searchId !== currentIndexOrQuery)) {
          selectSearchQueriesById(samples[currentIndexOrQuery]);
          setSelectedQuery(samples[currentIndexOrQuery].queries[0]);
        } else if (this.props.location.pathname !== whichProps.location.pathname) { // if the currentIndex and queries are different from our currently index and queries
          selectSearchQueriesById(samples[currentIndexOrQuery]);
        }
      }
    }
  }

  parseJSONParams = (queriesFromURL) => {
    let parsedObjectArray = JSON.parse(queriesFromURL);
    const colorPallette = idx => d3.schemeCategory20[idx < MAX_COLORS ? idx : 0];
    const parsedObjectArrayWithDefColor = parsedObjectArray.map((q, idx) => ({ ...q, color: unescape(q.color), defaultColor: colorPallette(idx) }));
    parsedObjectArray = parsedObjectArrayWithDefColor.map((q, idx) => {
      const defaultObjVals = {};
      if (q.label === undefined) {
        defaultObjVals.label = q.label || q.q; // TODO auto generate for logged in users!
      }
      if (q.color === undefined || q.color === 'undefined') {
        defaultObjVals.color = q.defaultColor; // generated from ColorWheel();
      }
      if (q.index === undefined) {
        defaultObjVals.index = idx; // the backend won't use these values, but this is for the QueryPicker display
      }
      if (q.sources === undefined) {
        defaultObjVals.sources = [];
      }
      if (q.collections === undefined) {
        defaultObjVals.collections = [DEFAULT_COLLECTION];
      }
      const dateObj = getPastTwoWeeksDateRange();
      if (q.startDate === undefined) {
        defaultObjVals.startDate = dateObj.start;
      }
      if (q.endDate === undefined) {
        defaultObjVals.endDate = dateObj.end;
      }
      return Object.assign({}, q, defaultObjVals);
    });

    return parsedObjectArray;
    // generate color and index?
  }

  render() {
    const { user, selected, queries, setSelectedQuery, handleSearch, samples, location } = this.props;
    // const { formatMessage } = this.props.intl;
    let content = <div>Error</div>;
    if (hasPermissions(getUserRoles(user), PERMISSION_LOGGED_IN)) {
      const isEditable = true;
      if (queries && queries.length > 0 && selected) {
        content = (
          <div>
            <QueryBuilderContainer isEditable={isEditable} setSelectedQuery={setSelectedQuery} handleSearch={() => handleSearch(queries)} />
            <QueryResultsContainer queries={queries} params={location} samples={samples} />
          </div>
        );
      }
    } else {
      content = <div>No Permissions</div>;
    }
    // TODO, decide whether to show QueryForm if in Demo mode
    return (
      <div>
        { content }
      </div>
    );
  }
}

LoggedInQueryContainer.propTypes = {
  intl: React.PropTypes.object.isRequired,
  // from parent
  initialValues: React.PropTypes.object,
  // from state
  location: React.PropTypes.object,
  user: React.PropTypes.object.isRequired,
  selected: React.PropTypes.object,
  queries: React.PropTypes.array,
  sourcesResults: React.PropTypes.array,
  samples: React.PropTypes.array,
  query: React.PropTypes.object,
  handleSearch: React.PropTypes.func.isRequired,
  setSampleSearch: React.PropTypes.func.isRequired,
  setSelectedQuery: React.PropTypes.func.isRequired,
  resetExplorerData: React.PropTypes.func.isRequired,
  selectSearchQueriesById: React.PropTypes.func.isRequired,
  selectQueriesByURLParams: React.PropTypes.func.isRequired,
  loadSampleSearches: React.PropTypes.func.isRequired,
  fetchSamples: React.PropTypes.func.isRequired,
  urlQueryString: React.PropTypes.string,
};

const mapStateToProps = (state, ownProps) => ({
  // queryFetchStatus: state.explorer.queries.fetchStatus,
  selected: state.explorer.selected,
  selectedQuery: state.explorer.selected ? state.explorer.selected.q : '',
  queries: state.explorer.queries ? state.explorer.queries : null,
  sourcesResults: state.explorer.sources ? state.explorer.sources.results : null,
  urlQueryString: ownProps.location.pathname,
  lastSearchTime: state.explorer.lastSearchTime,
  samples: state.explorer.samples.list,
  user: state.user,
});

// push any updates (including selected) into queries in state, will trigger async load in sub sections
const mapDispatchToProps = dispatch => ({
  setSelectedQuery: (queryObj) => {
    dispatch(selectQuery(queryObj));
  },
  resetExplorerData: () => { // TODO we will reduce this down to one call
    dispatch(resetSelected());
    dispatch(resetQueries());
    dispatch(resetSentenceCounts());
    dispatch(resetSamples());
    dispatch(resetStoryCounts());
    dispatch(resetGeo());
  },
  updateQueryList: (queryObj) => {
    dispatch(selectBySearchId(queryObj)); // query obj or search id?
  },
  handleSearch: (queries) => {
    const collection = JSON.stringify(DEFAULT_COLLECTION_OBJECT);
    const sources = '[]';
    let urlParamString = queries.map(query => `{"index":${query.index},"q":"${query.q}","startDate":"${query.startDate}","endDate":"${query.endDate}","sources":${sources},"collections":${collection}}`);
    urlParamString = `[${urlParamString}]`;
    const newLocation = `queries/search/${urlParamString}`;
    dispatch(push(newLocation));
    // this should keep the current selection...
  },
  setQueryFromURL: (queryArrayFromURL) => {
    dispatch(selectBySearchParams(queryArrayFromURL)); // load query data into queries
    // select first entry
    dispatch(selectQuery(queryArrayFromURL[0])); // default select first query
    queryArrayFromURL.map((q, idx) => {
      const queryInfo = {
        index: idx,
      };
      if (q.sources && q.sources.length > 0) {
        queryInfo.sources = q.sources.map(src => src.media_id);
        dispatch(fetchQuerySourcesByIds(queryInfo)); // get sources names
      }
      if (q.collections && q.collections.length > 0) {
        queryInfo.collections = q.collections.map(coll => coll.tags_id);
        dispatch(fetchQueryCollectionsByIds(queryInfo)); // get collection names
      }
      return 0;
    });
  },
  setSampleSearch: (searchObj) => {
    dispatch(selectBySearchId(searchObj)); // select/map search's queries
    searchObj.queries.map((q, idx) => {
      const queryInfo = {
        index: idx,
      };
      if (q.sources && q.sources.length > 0) {
        queryInfo.sources = q.sources;
        dispatch(fetchQuerySourcesByIds(queryInfo)); // get sources names
      }
      if (q.collections && q.collections.length > 0) {
        queryInfo.collections = q.collections;
        dispatch(fetchQueryCollectionsByIds(queryInfo)); // get collection names
      }
      return 0;
    });
  },
  fetchSamples: () => {
    dispatch(fetchSampleSearches()); // fetch all searches
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    selectSearchQueriesById: (searchObj) => {
      dispatchProps.setSampleSearch(searchObj);
    },
    selectQueriesByURLParams: (queryArray) => {
      dispatchProps.setQueryFromURL(queryArray);
    },
    loadSampleSearches: (currentIndex) => {
      dispatchProps.fetchSamples(currentIndex);
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      LoggedInQueryContainer
    )
  );
