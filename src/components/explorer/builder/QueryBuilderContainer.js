import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid } from 'react-flexbox-grid/lib';
import { selectQuery, updateTimestampForQueries, selectBySearchId, fetchSampleSearches } from '../../../actions/explorerActions';
// import QueryForm from './QueryForm';
import QueryPicker from './QueryPicker';
import QueryResultsContainer from './QueryResultsContainer';
// import { notEmptyString } from '../../../lib/formValidators';
import { getUserRoles, hasPermissions, PERMISSION_LOGGED_IN } from '../../../lib/auth';

/* const localMessages = {
  querySearch: { id: 'explorer.queryBuilder.advanced', defaultMessage: 'Search For' },
  searchHint: { id: 'explorer.queryBuilder.hint', defaultMessage: 'Search for ' },
}; */

class QueryBuilderContainer extends React.Component {

  componentWillReceiveProps(nextProps) {
    const { selected, samples, setSelectedQuery, loadSampleSearches } = this.props;
    // TODO better comparison
    // if a query is clicked or if the url is edited...
    // we might should break this into two different contaienrs: one for demo, one for logged in users...
    const url = nextProps.location.pathname;
    const currentIndex = url.slice(url.lastIndexOf('/') + 1, url.length);

    if (this.props.location.pathname !== nextProps.location.pathname && nextProps.location.pathname.includes('/queries/demo')) {
      if (!samples || samples.length === 0) {
        loadSampleSearches(currentIndex); // currentIndex
      } else {
        setSelectedQuery(samples[currentIndex].data[0]); // if we already have the searches
      }
    } else if (nextProps.location.pathname.includes('/queries/search')) {
      // parse query params
    }


    if ((selected === null || nextProps.selected === null) ||
      (selected && nextProps.selected &&
        (selected.q !== nextProps.selected.q ||
        selected.start_date !== nextProps.selected.start_date ||
        selected.end_date !== nextProps.selected.end_date))) {
      // if logged in, get any URL and parse it
      // if not, assume if anything is in the url, parseInt it and select it

      // if something else is clicked, then if logged in, we will push this into URL?
      // queryParams = selected
      const qObject = nextProps.selected ? nextProps.selected : nextProps.urlQueryString;
      setSelectedQuery(qObject);
    }
  }

  resetIfRequested = () => {
  }

  render() {
    const { selected, queries, setSelectedQuery, handleSearch, user, urlQueryString, samples } = this.props;
    // const { formatMessage } = this.props.intl;
    const isLoggedInUser = hasPermissions(getUserRoles(user), PERMISSION_LOGGED_IN);
    let content = <div>Error</div>;

    // TODO problem with initialValues not updating wr to selected value...
    if (queries && queries.length > 0 && selected) {
      content = (
        <div>
          <QueryPicker isEditable={isLoggedInUser} onClick={setSelectedQuery} handleSearch={handleSearch} />
          <QueryResultsContainer queries={queries} params={urlQueryString} samples={samples} />
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

QueryBuilderContainer.propTypes = {
  intl: React.PropTypes.object.isRequired,
  // from parent
  initialValues: React.PropTypes.object,
  // from state
  location: React.PropTypes.object,
  user: React.PropTypes.object.isRequired,
  selected: React.PropTypes.object,
  queries: React.PropTypes.array,
  samples: React.PropTypes.array,
  query: React.PropTypes.object,
  handleSearch: React.PropTypes.func.isRequired,
  setSampleSearch: React.PropTypes.func.isRequired,
  setSelectedQuery: React.PropTypes.func.isRequired,
  saveSearchQueriesToStore: React.PropTypes.func.isRequired,
  loadSampleSearches: React.PropTypes.func.isRequired,
  fetchSamples: React.PropTypes.func.isRequired,
  urlQueryString: React.PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
  // queryFetchStatus: state.explorer.queries.fetchStatus,
  selected: state.explorer.selected,
  selectedQuery: state.explorer.selected ? state.explorer.selected.q : '',
  queries: state.explorer.queries ? state.explorer.queries : null,
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
  setSampleSearch: (searchObj, stateProps) => {
    const isLoggedInUser = hasPermissions(getUserRoles(stateProps.user), PERMISSION_LOGGED_IN);

    if (isLoggedInUser) {
      // do we also need to select the query too?
      dispatch(selectQuery(searchObj));
    } else {
      dispatch(selectBySearchId(searchObj)); // this doesn't really do anything
      // select first entry
      dispatch(selectQuery(searchObj.data[0]));
    }
  },
  fetchSamples: (dispatchProps, stateProps, currentIndex) => {
    dispatch(fetchSampleSearches())
      .then((values) => {
        if (values.list && values.list.length > 0) {
          const queryObjWithSearchId = { ...values.list[currentIndex], searchId: currentIndex };
          dispatchProps.setSampleSearch(queryObjWithSearchId, stateProps);
        }
        // then select the first query index
      });
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    saveSearchQueriesToStore: (queryObj) => {
      dispatchProps.setSampleSearch(queryObj, stateProps);
    },
    loadSampleSearches: (currentIndex) => {
      dispatchProps.fetchSamples(dispatchProps, stateProps, currentIndex);
      // why can't I do a then here?
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      QueryBuilderContainer
    )
  );
