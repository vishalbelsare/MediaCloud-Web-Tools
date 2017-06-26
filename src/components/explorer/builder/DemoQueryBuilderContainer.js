import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid } from 'react-flexbox-grid/lib';
import { selectQuery, updateTimestampForQueries, selectBySearchId, selectBySearchParams, fetchSampleSearches, demoQuerySourcesByIds } from '../../../actions/explorerActions';
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
    const { samples, selectSearchQueriesById, selectQueriesByURLParams, setSelectedQuery, loadSampleSearches } = this.props;
    const url = nextProps.location.pathname;
    let currentIndexOrKeyword = url.slice(url.lastIndexOf('/') + 1, url.length);

    if (this.props.location.pathname !== nextProps.location.pathname &&
      nextProps.location.pathname.includes('/queries/demo/search')) {
      // parse query params
      // for demo mode, whatever the user enters in the homepage field is interpreted only as a keyword(s)
      // we will not have a sample search selected BTW
      // back end effectively ignores everything but the keyword
      // const dateObj = getPastTwoWeeksDateRange();

      const parsedObjectArray = this.parseJSONParams(currentIndexOrKeyword);
      selectQueriesByURLParams(parsedObjectArray);
      setSelectedQuery(parsedObjectArray[0]);
    } else if (this.props.location.pathname !== nextProps.location.pathname &&
      nextProps.location.pathname.includes('/queries/demo')) {
      // sample query id expected
      currentIndexOrKeyword = parseInt(currentIndexOrKeyword, 10);
      if (!samples || samples.length === 0) { // if not loaded as in bookmarked page
        loadSampleSearches(currentIndexOrKeyword); // currentIndex
      } else { // likely from home page or new query param
        selectSearchQueriesById(samples[currentIndexOrKeyword]);
        setSelectedQuery(samples[currentIndexOrKeyword].queries[0]); // if we already have the searches
      }
    }
  }

  parseJSONParams = (queriesFromURL) => {
    let parsedObjectArray = JSON.parse(queriesFromURL);
    parsedObjectArray = parsedObjectArray.map((q, idx) => {
      const defaultObjVals = {};
      if (q.label === undefined) {
        defaultObjVals.label = `gen${q.q}`; // TODO auto generate!
      }
      if (q.color === undefined) {
        defaultObjVals.color = 'red'; // generateFromColorWheel();
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
    // location could contain a keyword query or a sample search id
    // isEditable if not sample query
    // const url = location.pathname;
    // const currentIndexOrKeyword = parseInt(url.slice(url.lastIndexOf('/') + 1, url.length), 10);

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
  urlQueryString: React.PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
  // queryFetchStatus: state.explorer.queries.fetchStatus,
  selected: state.explorer.selected,
  selectedQuery: state.explorer.selected ? state.explorer.selected.q : '',
  queries: state.explorer.queries ? state.explorer.queries : null,
  sourcesResults: state.explorer.sources ? state.explorer.sources.results : null,
  urlQueryString: ownProps.location.query,
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
    dispatch(selectBySearchId(searchObj)); // load sample data into queries
    // select first entry
    dispatch(selectQuery(searchObj.queries[0])); // default select first query
  },
  fetchSamples: (currentIndex) => {
    dispatch(fetchSampleSearches())
      .then((values) => {
        if (values.list && values.list.length > 0) {
          const searchObjWithSearchId = { ...values.list[currentIndex], searchId: currentIndex };
          // these can happen concurrently
          dispatch(selectBySearchId(searchObjWithSearchId)); // load sample data into queries
          const defaultSelectedQuery = searchObjWithSearchId.queries[0];
          dispatch(selectQuery(defaultSelectedQuery));
          searchObjWithSearchId.queries.map((query, idx) => {
            const demoInfo = {
              ...query, // add it here but also in reducer...
              index: idx,
            };
            return dispatch(demoQuerySourcesByIds(demoInfo));
          });
        }
        // then select the first query index
      });
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
      // why can't I do a then here?
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      DemoQueryBuilderContainer
    )
  );
