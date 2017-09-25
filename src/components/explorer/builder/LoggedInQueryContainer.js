import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { updateTimestampForQueries, resetSelected, resetQueries, resetSentenceCounts, resetSampleStories,
  resetStoryCounts, resetGeo, selectQuery } from '../../../actions/explorerActions';
import { addNotice } from '../../../actions/appActions';
import QueryBuilderContainer from './QueryBuilderContainer';
import QueryResultsContainer from '../results/QueryResultsContainer';
import { emptyString } from '../../../lib/formValidators';
import { generateQueryParamString } from '../../../lib/explorerUtil';
import { LEVEL_ERROR } from '../../common/Notice';
import composeUrlBasedQueryContainer from '../UrlBasedQueryContainer';

const localMessages = {
  errorInURLParams: { id: 'explorer.queryBuilder.urlParams', defaultMessage: 'Your URL query is incomplete. Check the URL and make sure the keyword(s), start and end dates, and collection(s) are properly specified.' },
  queryStringEmpty: { id: 'explorer.queryBuilder.queryStringEmpty', defaultMessage: 'At least one query: {name}, contain an empty query parameter. Please either fill in or delete query.' },
};

class LoggedInQueryContainer extends React.Component {
  componentWillMount() {
    const { selectFirstQuery, queries } = this.props;
    // console.log(queries[0]);
    selectFirstQuery(queries[0]);  // on first load select first by default so the builder knows which one to render in the form
  }
  componentWillUnmount() {
    const { resetExplorerData } = this.props;
    resetExplorerData();
  }
  render() {
    const { queries, handleSearch, samples, lastSearchTime } = this.props;
    const isEditable = false;
    return (
      <div className="query-container query-container-logged-in">
        <QueryBuilderContainer isEditable={isEditable} onSearch={() => handleSearch(queries)} />
        <QueryResultsContainer lastSearchTime={lastSearchTime} queries={queries} samples={samples} />
      </div>
    );
  }
}

LoggedInQueryContainer.propTypes = {
  intl: PropTypes.object.isRequired,
  // from parent
  initialValues: PropTypes.object,
  // from state
  selected: PropTypes.object,
  queries: PropTypes.array,
  samples: PropTypes.array,
  query: PropTypes.object,
  // from dispatch
  resetExplorerData: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  lastSearchTime: PropTypes.number,
  // from dispath
  selectFirstQuery: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  selected: state.explorer.selected,
  selectedQuery: state.explorer.selected,
  queries: state.explorer.queries.queries,
  lastSearchTime: state.explorer.lastSearchTime.time,
  samples: state.explorer.samples.list,
});

// push any updates (including selected) into queries in state, will trigger async load in sub sections
const mapDispatchToProps = (dispatch, ownProps) => ({
  resetExplorerData: () => { // TODO we will reduce this down to one call
    dispatch(resetSelected());
    dispatch(resetQueries());
    dispatch(resetSentenceCounts());
    dispatch(resetSampleStories());
    dispatch(resetStoryCounts());
    dispatch(resetGeo());
  },
  handleSearch: (queries) => {
    const emptyQueryStrings = queries.filter(q => emptyString(q.q));
    if (emptyQueryStrings.length > 0) {
      dispatch(addNotice({ level: LEVEL_ERROR, message: ownProps.intl.formatMessage(localMessages.queryStringEmpty, { name: emptyQueryStrings[0].label }) }));
      return;
    }
    const unDeletedQueries = queries.filter(q => q.deleted !== true);
    dispatch(resetSelected());
    dispatch(resetQueries());
    dispatch(updateTimestampForQueries());
    const urlParamString = generateQueryParamString(unDeletedQueries);
    const newLocation = `/queries/search/[${urlParamString}]`;
    dispatch(push(newLocation));
  },
  selectFirstQuery: (query) => {
    dispatch(selectQuery(query));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeUrlBasedQueryContainer()(
        LoggedInQueryContainer
      )
    )
  );
