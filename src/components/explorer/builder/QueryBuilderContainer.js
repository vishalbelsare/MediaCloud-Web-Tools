import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { selectQuery } from '../../../actions/explorerActions';
import QueryForm from './QueryForm';
import QueryPicker from './QueryPicker';
import { notEmptyString } from '../../../lib/formValidators';
import { getUserRoles, hasPermissions, PERMISSION_LOGGED_IN } from '../../../lib/auth';

const localMessages = {
  querySearch: { id: 'explorer.queryBuilder.advanced', defaultMessage: 'Search For' },
  searchHint: { id: 'explorer.queryBuilder.hint', defaultMessage: 'Search for ' },
};

class QueryBuilderContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      initialQuery: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    const { selected, setSelectedQuery } = this.props;
    // TODO better comparison
    if (selected === null || (notEmptyString(nextProps.urlQueryString.query) && nextProps.urlQueryString.query !== JSON.stringify(selected))) {
      // make sure this is a valid query string
      // if not logged in, ignore/strip out anything but keywords?
      // const var1 = '{"keyword": "public"}';
      // TODO formatting of query or param
      const qObject = JSON.parse(nextProps.urlQueryString.query);
      setSelectedQuery(qObject);
    }
  }

  resetIfRequested = () => {
  }

  render() {
    const { selected, queries, handleSearch, user } = this.props;
    const { formatMessage } = this.props.intl;
    const isLoggedInUser = hasPermissions(getUserRoles(user), PERMISSION_LOGGED_IN);
    let content = <div>Error</div>;

    if (queries && queries.length > 0 && selected) {
      content = (
        <div>
          <QueryPicker selected={selected} queries={queries} isEditable={isLoggedInUser} />
          <QueryForm initialValues={selected} buttonLabel={formatMessage(localMessages.querySearch)} onSave={handleSearch} isEditable={isLoggedInUser} />
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

const mapDispatchToProps = dispatch => ({
  handleSearch: (queries) => {
    const infoToQuery = queries;
    // TODO if in Demo mode, constrain by two-week period
    // assimilate field array level query info
    dispatch(selectQuery(infoToQuery));
    // will trigger async load in sub sections
  },
  setSelectedQuery: (queryObj) => {
    // push url data from params into store
    // this should setup initialValues
    dispatch(selectQuery(queryObj)); // where to push into queries object?
    // dispatch(fetchSavedQueryList());
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
