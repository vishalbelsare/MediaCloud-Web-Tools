import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import * as d3 from 'd3';
import { selectQuery, selectBySearchId, selectBySearchParams, updateQuerySourceLookupInfo, updateQueryCollectionLookupInfo,
  fetchSampleSearches, fetchQuerySourcesByIds, fetchQueryCollectionsByIds, updateTimestampForQueries,
  resetSelected, resetQueries, resetSentenceCounts, resetSampleStories, resetStoryCounts, resetGeo } from '../../../actions/explorerActions';
import { addNotice } from '../../../actions/appActions';
import QueryBuilderContainer from './QueryBuilderContainer';
import QueryResultsContainer from './QueryResultsContainer';
import { emptyString } from '../../../lib/formValidators';
import { getUserRoles, hasPermissions, PERMISSION_LOGGED_IN } from '../../../lib/auth';
import { generateQueryParamString } from '../../../lib/explorerUtil';
import * as fetchConstants from '../../../lib/fetchConstants';
import { LEVEL_ERROR } from '../../common/Notice';
import LoadingSpinner from '../../common/LoadingSpinner';

const localMessages = {
  errorInURLParams: { id: 'explorer.queryBuilder.urlParams', defaultMessage: 'Your URL query is incomplete. Check the URL and make sure the keyword(s), start and end dates, and collection(s) are properly specified.' },
  queryStringEmpty: { id: 'explorer.queryBuilder.queryStringEmpty', defaultMessage: 'At least one query: {name}, contain an empty query parameter. Please either fill in or delete query.' },
};

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
    const { samples, selected, loadSampleSearches, selectSearchQueriesById, setSelectedQuery, selectQueriesByURLParams, addAppNotice } = this.props;
    const { formatMessage } = this.props.intl;
    const url = whichProps.location.pathname;
    let currentIndexOrQuery = url.slice(url.lastIndexOf('/') + 1, url.length);

    // for Logged In users, we expect the URL to have query, start/end dates and at least one collection. Throw an error if this is missing
    if (hasPermissions(getUserRoles(whichProps.user), PERMISSION_LOGGED_IN)) {
      if (whichProps.location.pathname.includes('/queries/search')) {
        // parse query params
        let parsedObjectArray = null;
        try {
          parsedObjectArray = this.parseJSONParams(currentIndexOrQuery);
        } catch (e) {
          addAppNotice({ level: LEVEL_ERROR, message: formatMessage(localMessages.errorInURLParams) });
          return;
        }

        if (this.props.lastSearchTime !== whichProps.lastSearchTime ||
          url !== this.props.location.pathname || // url has been updated by handleSearch
          (!selected && !whichProps.selected &&
          (!whichProps.queries || whichProps.queries.length === 0 ||
          whichProps.collectionLookupFetchStatus === fetchConstants.FETCH_INVALID))) {
          selectQueriesByURLParams(parsedObjectArray);
        } else if (!selected && !whichProps.selected && whichProps.collectionLookupFetchStatus === fetchConstants.FETCH_SUCCEEDED) {
          setSelectedQuery(whichProps.queries[0]); // once we have the lookups,
        }
      } else if (whichProps.location.pathname.includes('/queries')) {
        currentIndexOrQuery = parseInt(currentIndexOrQuery, 10);

        if (!whichProps.samples || whichProps.samples.length === 0) { // if not loaded as in bookmarked page
          loadSampleSearches(currentIndexOrQuery); // currentIndex
        } else if (!selected && !whichProps.selected && (!whichProps.queries || whichProps.queries.length === 0)) {
          selectSearchQueriesById(samples[currentIndexOrQuery]);
        } else if (!selected && !whichProps.selected && whichProps.collectionLookupFetchStatus === fetchConstants.FETCH_SUCCEEDED) {
          setSelectedQuery(samples[currentIndexOrQuery].queries[0]);
        }
      }
    }
  }

  parseJSONParams = (queriesFromURL) => {
    let parsedObjectArray = JSON.parse(queriesFromURL);
    const colorPallette = idx => d3.schemeCategory10[idx < MAX_COLORS ? idx : 0];
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
      if (q.q === undefined || q.collections === undefined || q.startDate === undefined || q.endDate === undefined) {
        // this means an error
        throw new Error();
      }
      return Object.assign({}, q, defaultObjVals);
    });

    return parsedObjectArray;
    // generate color and index?
  }

  render() {
    const { user, selected, queries, collectionLookupFetchStatus, handleSearch, samples, location, lastSearchTime } = this.props;
    // const { formatMessage } = this.props.intl;
    let content = <LoadingSpinner />;
    if (hasPermissions(getUserRoles(user), PERMISSION_LOGGED_IN)) {
      const isEditable = false;
      // don't render unless we have all the pieces
      if (queries && queries.length > 0 && selected &&
        collectionLookupFetchStatus === fetchConstants.FETCH_SUCCEEDED) {
        if (selected.sources.length === 0 || (selected.sources.length > 0 && selected.sources[0].url !== undefined)) {
          content = (
            <div>
              <QueryBuilderContainer isEditable={isEditable} handleSearch={() => handleSearch(queries)} />
              <QueryResultsContainer lastSearchTime={lastSearchTime} queries={queries} params={location} samples={samples} />
            </div>
          );
        }
      }
    } else {
      content = <div>No Permissions</div>;
    }
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
  addAppNotice: React.PropTypes.func.isRequired,
  selected: React.PropTypes.object,
  queries: React.PropTypes.array,
  collectionResults: React.PropTypes.array,
  collectionLookupFetchStatus: React.PropTypes.string,
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
  lastSearchTime: React.PropTypes.number,
};

const mapStateToProps = (state, ownProps) => ({
  // queryFetchStatus: state.explorer.queries.fetchStatus,
  selected: state.explorer.selected,
  selectedQuery: state.explorer.selected ? state.explorer.selected.q : '',
  queries: state.explorer.queries.queries ? state.explorer.queries.queries : null,
  collectionResults: state.explorer.queries.collections ? state.explorer.queries.collections.results : null,
  collectionLookupFetchStatus: state.explorer.queries.collections.fetchStatus,
  urlQueryString: ownProps.location.pathname,
  lastSearchTime: state.explorer.lastSearchTime.time,
  samples: state.explorer.samples.list,
  user: state.user,
});

// push any updates (including selected) into queries in state, will trigger async load in sub sections
const mapDispatchToProps = (dispatch, ownProps) => ({
  addAppNotice: (info) => {
    dispatch(addNotice(info));
  },
  setSelectedQuery: (queryObj) => {
    dispatch(selectQuery(queryObj));
  },
  resetExplorerData: () => { // TODO we will reduce this down to one call
    dispatch(resetSelected());
    dispatch(resetQueries());
    dispatch(resetSentenceCounts());
    dispatch(resetSampleStories());
    dispatch(resetStoryCounts());
    dispatch(resetGeo());
  },
  updateQueryList: (queryObj) => {
    dispatch(selectBySearchId(queryObj)); // query obj or search id?
  },
  handleSearch: (queries) => {
    const emptyQueryStrings = queries.filter(q => emptyString(q.q));
    if (emptyQueryStrings.length > 0) {
      dispatch(addNotice({ level: LEVEL_ERROR, message: ownProps.intl.formatMessage(localMessages.queryStringEmpty, { name: emptyQueryStrings[0].label }) }));
      return;
    }
    const unDeletedQueries = queries.filter(q => !q.deleted);
    dispatch(resetSelected());
    dispatch(resetQueries());
    dispatch(updateTimestampForQueries());
    const urlParamString = generateQueryParamString(unDeletedQueries);
    const newLocation = `/queries/search/[${urlParamString}]`;
    dispatch(push(newLocation));
    // this should keep the current selection...
  },
  setQueryFromURL: (queryArrayFromURL) => {
    dispatch(selectBySearchParams(queryArrayFromURL)); // load query data into queries
    // lookup ancillary data eg collection and source info for display purposes in QueryForm
    queryArrayFromURL.map((q, idx) => {
      const queryInfo = {
        index: idx,
        ...q,
      };
      if (q.sources && q.sources.length > 0) {
        queryInfo.sources = q.sources.map(src => src.media_id || src.id);
        dispatch(fetchQuerySourcesByIds(queryInfo))
        .then((results) => {
          queryInfo.sources = results;
          dispatch(updateQuerySourceLookupInfo(queryInfo)); // updates the query and the selected query
        });
      }
      if (q.collections && q.collections.length > 0) {
        queryInfo.collections = q.collections.map(coll => coll.tags_id || coll.id);
        dispatch(fetchQueryCollectionsByIds(queryInfo))
        .then((results) => {
          queryInfo.collections = results;
          dispatch(updateQueryCollectionLookupInfo(queryInfo)); // updates the query and the selected query
        });
      }
      return 0;
    });
    // dispatch(selectQuery(queryArrayFromURL[0])); // default select first query
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
