import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid } from 'react-flexbox-grid/lib';
import { selectQuery, setQueryList } from '../../../actions/explorerActions';
import QueryForm from './QueryForm';
import QueryPicker from './QueryPicker';
// import { notEmptyString } from '../../../lib/formValidators';
import { getUserRoles, hasPermissions, PERMISSION_LOGGED_IN } from '../../../lib/auth';

const localMessages = {
  querySearch: { id: 'explorer.queryBuilder.advanced', defaultMessage: 'Search For' },
  searchHint: { id: 'explorer.queryBuilder.hint', defaultMessage: 'Search for ' },
};

class QueryBuilderContainer extends React.Component {

  componentWillReceiveProps(nextProps) {
    const { selected, setSelectedQuery } = this.props;
    // TODO better comparison
    // if a query is clicked or if the url is edited...
    // THis is definitely not working right..
    if (selected === null || nextProps.selected === null) {
      // make sure this is a valid query string
      // if not logged in, ignore/strip out anything but keywords?
      // const var1 = '{"keyword": "public"}';
      // TODO formatting of query or param

      // but what if clicked? this is changing the selection, not the query string
      const qObject = JSON.parse(nextProps.urlQueryString.query);
      setSelectedQuery(qObject);
    }
  }

  resetIfRequested = () => {
  }

  render() {
    const { selected, queries, handleSearch, setSelectedQuery, user } = this.props;
    const { formatMessage } = this.props.intl;
    const isNotLoggedInUser = !(hasPermissions(getUserRoles(user), PERMISSION_LOGGED_IN));
    let content = <div>Error</div>;

    // TODO problem with initialValues not updating wr to selected value...
    if (queries && queries.length > 0 && selected) {
      content = (
        <div>
          <QueryPicker selected={selected} queries={queries} isEditable={isNotLoggedInUser} onClick={setSelectedQuery} />
          <QueryForm initialValues={selected} buttonLabel={formatMessage(localMessages.querySearch)} onSave={handleSearch} isEditable={isNotLoggedInUser} />
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
  queries: state.explorer.queries.list,
  urlQueryString: ownProps.location.query,
  user: state.user,
});

// push any updates (including selected) into queries in state, will trigger async load in sub sections
const mapDispatchToProps = dispatch => ({
  handleSearch: (queries) => {
    const infoToQuery = queries;
    // TODO if in Demo mode, constrain by two-week period
    // assimilate field array level query info
    // will push new/custom query into list as well
    dispatch(setQueryList(infoToQuery));
  },
  // this will push selected into state
  // either an id (demo) or a query url (loggedin)
  setSelectedQuery: (queryType) => {
    // const isLoggedInUser = hasPermissions(getUserRoles(state.user), PERMISSION_LOGGED_IN);

    // if (isLoggedInUser) {
    //  dispatch(selectQuery(queryType)); // query string - we will select the custom tab for them unless there is an id in url
      // dispatch(fetchSavedQueryList());
    // } else {
    dispatch(selectQuery(queryType)); // query id
      // dispatch(fetchExampleQueryList());
    // }
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
