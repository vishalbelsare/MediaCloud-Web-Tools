import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid } from 'react-flexbox-grid/lib';
import { selectQuery, updateTimestampForQueries, selectBySearchId } from '../../../actions/explorerActions';
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
    const { selected, queries, setSelectedQuery, saveSearchQueriesToStore, urlQueryString } = this.props;
    // TODO better comparison
    // if a query is clicked or if the url is edited...
    // THis is definitely not working right..
    if ((nextProps.urlQueryString.searchId && queries == null) ||
      urlQueryString.searchId !== nextProps.urlQueryString.searchId) {
      saveSearchQueriesToStore(nextProps.urlQueryString);
    } else if ((selected === null || nextProps.selected === null) ||
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
  user: React.PropTypes.object.isRequired,
  selected: React.PropTypes.object,
  queries: React.PropTypes.array,
  samples: React.PropTypes.array,
  query: React.PropTypes.object,
  handleSearch: React.PropTypes.func.isRequired,
  setSelectedQuery: React.PropTypes.func.isRequired,
  saveSearchQueriesToStore: React.PropTypes.func.isRequired,
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
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    saveSearchQueriesToStore: (queryObj) => {
      const isLoggedInUser = hasPermissions(getUserRoles(stateProps.user), PERMISSION_LOGGED_IN);

      if (isLoggedInUser) {
        dispatchProps.setSelectedQuery(queryObj);
      } else {
        const queryList = stateProps.samples[parseInt(queryObj.searchId, 10)];
        dispatchProps.updateQueryList(queryList);
        // select first entry
        dispatchProps.setSelectedQuery(queryList.data[0]);
      }
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      QueryBuilderContainer
    )
  );
