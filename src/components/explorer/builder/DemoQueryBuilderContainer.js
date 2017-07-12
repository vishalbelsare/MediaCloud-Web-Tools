import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import * as d3 from 'd3';
import { selectQuery, selectBySearchId, selectBySearchParams, fetchSampleSearches, demoQuerySourcesByIds, demoQueryCollectionsByIds } from '../../../actions/explorerActions';
// import QueryForm from './QueryForm';
import QueryPicker from './QueryPicker';
import QueryResultsContainer from './QueryResultsContainer';
import { getPastTwoWeeksDateRange } from '../../../lib/dateUtil';

// import { notEmptyString } from '../../../lib/formValidators';
/* const localMessages = {
  querySearch: { id: 'explorer.queryBuilder.advanced', defaultMessage: 'Search For' },
  searchHint: { id: 'explorer.queryBuilder.hint', defaultMessage: 'Search for ' },
}; */
const MAX_COLORS = 20;

class DemoQueryBuilderContainer extends React.Component {
  componentWillMount() {
    const { selected } = this.props;
    if (!selected) {
      this.checkPropsAndDispatch(this.props);
    }
  }
  componentWillReceiveProps(nextProps) {
    this.checkPropsAndDispatch(nextProps);
  }
  checkPropsAndDispatch(whichProps) {
    const { samples, selected, selectSearchQueriesById, selectQueriesByURLParams, setSelectedQuery, loadSampleSearches } = this.props;
    const url = whichProps.location.pathname;
    let currentIndexOrQuery = url.slice(url.lastIndexOf('/') + 1, url.length);
    if (whichProps.location.pathname.includes('/queries/demo/search')) {
      // parse query params
      // for demo mode, whatever the user enters in the homepage field is interpreted only as a keyword(s)
      // we will not have a sample search selected BTW
      // back end effectively ignores everything but the keyword

      const parsedObjectArray = this.parseJSONParams(currentIndexOrQuery);
      if (this.props.location.pathname !== whichProps.location.pathname) {
        // could we check to see if we have added any new queries... otherwise just an update...
        // and we keep current selection
        selectQueriesByURLParams(parsedObjectArray);
        setSelectedQuery(parsedObjectArray[0]); // how to not do this if we want to keep currentselection
      } else if (!selected && !whichProps.selected) {
        selectQueriesByURLParams(parsedObjectArray);
        setSelectedQuery(parsedObjectArray[0]);
      }
    } else if (whichProps.location.pathname.includes('/queries/demo')) {
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
        defaultObjVals.collections = [8875027];
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
    const { selected, queries, setSelectedQuery, handleSearch, samples, location } = this.props;
    // const { formatMessage } = this.props.intl;
    let content = <div>Error</div>;
    const isEditable = location.pathname.includes('queries/demo/search');
    if (queries && queries.length > 0 && selected) {
      content = (
        <div>
          <QueryPicker isEditable={isEditable} onClick={setSelectedQuery} handleSearch={() => handleSearch(queries)} />
          <QueryResultsContainer queries={queries} params={location} samples={samples} />
        </div>
      );
    }
    // TODO, decide whether to show QueryForm if in Demo mode
    return (
      <div>
        { content }
      </div>
    );
  }
}

DemoQueryBuilderContainer.propTypes = {
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
  updateQueryList: (queryObj) => {
    dispatch(selectBySearchId(queryObj)); // query obj or search id?
  },
  handleSearch: (queries) => {
    // let urlParamString = queries.map(q => `{"index":${q.index},"q":"${q.q}","color":"${q.color}","sources":[${q.sources}],"collections":[${q.collections.map(c => (typeof c === 'number' ? c : c.tags_id || c.id))}]}`);
    const urlParamString = queries.map(q => `{"index":${q.index},"q":"${q.q}","color":"${escape(q.color)}"}`);
    const newLocation = `queries/demo/search/[${urlParamString}]`;
    dispatch(push(newLocation));
    // this should keep the current selection...
  },
  setQueryFromURL: (queryArrayFromURL) => {
    dispatch(selectBySearchParams(queryArrayFromURL)); // load query data into queries
    // select first entry
    dispatch(selectQuery(queryArrayFromURL[0])); // default select first query
    queryArrayFromURL.map((q, idx) => {
      const demoInfo = {
        index: idx,
      };
      if (q.sources && q.sources.length > 0) {
        demoInfo.sources = q.sources;
        dispatch(demoQuerySourcesByIds(demoInfo)); // get sources names
      }
      if (q.collections && q.collections.length > 0) {
        demoInfo.collections = q.collections;
        dispatch(demoQueryCollectionsByIds(demoInfo)); // get collection names
      }
      return 0;
    });
  },
  setSampleSearch: (searchObj) => {
    dispatch(selectBySearchId(searchObj)); // select/map search's queries
    searchObj.queries.map((q, idx) => {
      const demoInfo = {
        index: idx,
      };
      if (q.sources && q.sources.length > 0) {
        demoInfo.sources = q.sources;
        dispatch(demoQuerySourcesByIds(demoInfo)); // get sources names
      }
      if (q.collections && q.collections.length > 0) {
        demoInfo.collections = q.collections;
        dispatch(demoQueryCollectionsByIds(demoInfo)); // get collection names
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
      DemoQueryBuilderContainer
    )
  );
