import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid } from 'react-flexbox-grid/lib';
import { selectQuery, updateTimestampForQueries, selectBySearchId, fetchSampleSearches, demoQuerySourcesByIds } from '../../../actions/explorerActions';
// import QueryForm from './QueryForm';
import QueryPicker from './QueryPicker';
import QueryResultsContainer from './QueryResultsContainer';
// import { notEmptyString } from '../../../lib/formValidators';
/* const localMessages = {
  querySearch: { id: 'explorer.queryBuilder.advanced', defaultMessage: 'Search For' },
  searchHint: { id: 'explorer.queryBuilder.hint', defaultMessage: 'Search for ' },
}; */

class DemoQueryBuilderContainer extends React.Component {

  componentWillReceiveProps(nextProps) {
    const { selected, samples, selectSearchQueries, setSelectedQuery, loadSampleSearches } = this.props;
    // TODO better comparison
    // if a query is clicked or if the url is edited...
    // we might should break this into two different contaienrs: one for demo, one for logged in users...
    const url = nextProps.location.pathname;
    const currentIndex = parseInt(url.slice(url.lastIndexOf('/') + 1, url.length), 10);

    if (this.props.location.pathname !== nextProps.location.pathname && nextProps.location.pathname.includes('/queries/demo')) {
      if (!samples || samples.length === 0) {
        loadSampleSearches(currentIndex); // currentIndex
      } else {
        selectSearchQueries(samples[currentIndex]);
        setSelectedQuery(samples[currentIndex].data[0]); // if we already have the searches
      }
    }

    if ((selected === null || nextProps.selected === null) ||
      (selected && nextProps.selected &&
        (selected.q !== nextProps.selected.q ||
        selected.start_date !== nextProps.selected.start_date ||
        selected.end_date !== nextProps.selected.end_date))) {
      // assume if anything is in the url, parseInt it and select it

      // if something else is clicked, then if logged in, we will push this into URL?
      // queryParams = selected
      const qObject = nextProps.selected ? nextProps.selected : nextProps.urlQueryString;
      setSelectedQuery(qObject);
    }
  }

  render() {
    const { selected, queries, setSelectedQuery, handleSearch, samples, location } = this.props;
    // const { formatMessage } = this.props.intl;
    let content = <div>Error</div>;
    // location could contain a keyword query or a sample search id
    // isEditable if not sample query
    const isEditable = location.pathname.includes('queries/search');
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
  selectSearchQueries: React.PropTypes.func.isRequired,
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
  setSampleSearch: (searchObj) => {
    dispatch(selectBySearchId(searchObj)); // load sample data into queries
    // select first entry
    dispatch(selectQuery(searchObj.data[0])); // default select first query
  },
  fetchSamples: (currentIndex) => {
    dispatch(fetchSampleSearches())
      .then((values) => {
        if (values.list && values.list.length > 0) {
          const searchObjWithSearchId = { ...values.list[currentIndex], searchId: currentIndex };
          // these can happen concurrently
          dispatch(selectBySearchId(searchObjWithSearchId)); // load sample data into queries
          const defaultSelectedQuery = searchObjWithSearchId.data[0];
          dispatch(selectQuery(defaultSelectedQuery));
          searchObjWithSearchId.data.map((query, idx) => {
            const demoInfo = {
              ...query,
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
    selectSearchQueries: (searchObj) => {
      dispatchProps.setSampleSearch(searchObj);
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
