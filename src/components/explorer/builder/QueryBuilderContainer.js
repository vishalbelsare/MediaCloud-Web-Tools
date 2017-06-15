import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid } from 'react-flexbox-grid/lib';
import { selectQuery, updateTimestampForQueries } from '../../../actions/explorerActions';
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
    const { selected, setSelectedQuery } = this.props;
    // TODO better comparison
    // if a query is clicked or if the url is edited...
    // THis is definitely not working right..
    if (selected === null || nextProps.selected === null ||
      selected.q !== nextProps.selected.q ||
      selected.start_date !== nextProps.selected.start_date ||
      selected.end_date !== nextProps.selected.end_date) {
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
    const { selected, queries, setSelectedQuery, handleSearch, user } = this.props;
    // const { formatMessage } = this.props.intl;
    const isNotLoggedInUser = !(hasPermissions(getUserRoles(user), PERMISSION_LOGGED_IN));
    let content = <div>Error</div>;

    // TODO problem with initialValues not updating wr to selected value...
    if (queries && queries.length > 0 && selected) {
      content = (
        <div>
          <QueryPicker isEditable={isNotLoggedInUser} onClick={setSelectedQuery} handleSearch={handleSearch} />
          <QueryResultsContainer queries={queries} />
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
  query: React.PropTypes.object,
  handleSearch: React.PropTypes.func.isRequired,
  setSelectedQuery: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  // queryFetchStatus: state.explorer.queries.fetchStatus,
  selected: state.explorer.selected,
  selectedQuery: state.explorer.selected ? state.explorer.selected.q : '',
  queries: state.explorer.queries.list,
  urlQueryString: ownProps.location.query,
  user: state.user,
});

// push any updates (including selected) into queries in state, will trigger async load in sub sections
const mapDispatchToProps = dispatch => ({
  setSelectedQuery: (queryType) => {
    // const isLoggedInUser = hasPermissions(getUserRoles(state.user), PERMISSION_LOGGED_IN);

    // if (isLoggedInUser) {
    //  dispatch(selectQuery(queryType)); // query string - we will select the custom tab for them unless there is an id in url
      // dispatch(fetchSavedSearches());
    // } else {
    dispatch(selectQuery(queryType)); // query obj
      // dispatch(fetchExampleQueryList());
    // }
  },
  handleSearch: () => {
    dispatch(updateTimestampForQueries());
  },
});

QueryBuilderContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
};

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      QueryBuilderContainer
    )
  );
