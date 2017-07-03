import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid } from 'react-flexbox-grid/lib';
import * as d3 from 'd3';
import { selectQuery, updateTimestampForQueries, selectBySearchId, selectBySearchParams, fetchSampleSearches, demoQuerySourcesByIds, demoQueryCollectionsByIds } from '../../../actions/explorerActions';
// import QueryForm from './QueryForm';
import QueryPicker from './QueryPicker';
import QueryResultsContainer from './QueryResultsContainer';
import { getPastTwoWeeksDateRange } from '../../../lib/dateUtil';

// import { notEmptyString } from '../../../lib/formValidators';
/* const localMessages = {
  querySearch: { id: 'explorer.queryBuilder.advanced', defaultMessage: 'Search For' },
  searchHint: { id: 'explorer.queryBuilder.hint', defaultMessage: 'Search for ' },
}; */

class DemoQueryBuilderContainer extends React.Component {

  componentWillReceiveProps(nextProps) {
    const { samples, selected, selectSearchQueriesById, selectQueriesByURLParams, setSelectedQuery, loadSampleSearches } = this.props;
    const url = nextProps.location.pathname;
    let currentIndexOrKeyword = url.slice(url.lastIndexOf('/') + 1, url.length);

    if (nextProps.location.pathname.includes('/queries/demo/search')) {
      // parse query params
      // for demo mode, whatever the user enters in the homepage field is interpreted only as a keyword(s)
      // we will not have a sample search selected BTW
      // back end effectively ignores everything but the keyword
      // const dateObj = getPastTwoWeeksDateRange();
      if (this.props.location.pathname !== nextProps.location.pathname) {
        const parsedObjectArray = this.parseJSONParams(currentIndexOrKeyword);
        selectQueriesByURLParams(parsedObjectArray);
        setSelectedQuery(parsedObjectArray[0]);
      }
    } else if (nextProps.location.pathname.includes('/queries/demo')) {
      currentIndexOrKeyword = parseInt(currentIndexOrKeyword, 10);

      if (!samples || samples.length === 0) { // if not loaded as in bookmarked page
        loadSampleSearches(currentIndexOrKeyword); // currentIndex
      } else if ((!selected && !nextProps.selected) || (nextProps.selected && nextProps.selected.searchId !== currentIndexOrKeyword)) {
        setSelectedQuery(samples[currentIndexOrKeyword].queries[0]);
        selectSearchQueriesById(samples[currentIndexOrKeyword]);
      } else if (this.props.location.pathname !== nextProps.location.pathname) { // if the currentIndex and queries are different from our currently index and queries
        selectSearchQueriesById(samples[currentIndexOrKeyword]);
      }
    }
  }

  colorPallette = () => d3.scaleOrdinal(d3.schemeCategory20);

  parseJSONParams = (queriesFromURL) => {
    let parsedObjectArray = JSON.parse(queriesFromURL);

    const parsedObjectArrayWithDefColor = parsedObjectArray.map((q, idx) => ({ ...q, defaultColor: this.colorPallette(idx)() }));
    parsedObjectArray = parsedObjectArrayWithDefColor.map((q, idx) => {
      const defaultObjVals = {};
      if (q.label === undefined) {
        defaultObjVals.label = `gen${q.q}`; // TODO auto generate!
      }
      if (q.color === undefined) {
        defaultObjVals.color = q.defaultColor; // generateFromColorWheel();
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
          <QueryPicker isEditable={isEditable} onClick={setSelectedQuery} handleSearch={handleSearch} />
          <QueryResultsContainer queries={queries} params={location} samples={samples} />
        </div>
      );
    }
    // TODO, decide whether to show QueryForm if in Demo mode
    return (
      <Grid>
        { content }
      </Grid>
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
  handleSearch: () => {
    dispatch(updateTimestampForQueries());
  },
  setQueryFromURL: (queryArrayFromURL) => {
    dispatch(selectBySearchParams(queryArrayFromURL)); // load query data into queries
    // select first entry
    dispatch(selectQuery(queryArrayFromURL[0])); // default select first query
  },
  setSampleSearch: (searchObj) => {
    dispatch(selectBySearchId(searchObj)); // select/map search's queries
    const queriesWithSources = searchObj.queries.map((q) => {
      const src = q.sources;
      return src > 0 ? src : null;
    }).filter(s => s);
    if (queriesWithSources.length > 0) {
      dispatch(demoQuerySourcesByIds(queriesWithSources)); // get sources names
    }
    const queriesWithCollections = searchObj.queries.map((q) => {
      const coll = q.collections;
      return coll.length > 0 ? coll : null;
    }).filter(c => [...c]);
    if (queriesWithCollections.length > 0) {
      dispatch(demoQueryCollectionsByIds(queriesWithCollections)); // get collection names
    }
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
