import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedHTMLMessage } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { selectQuery, selectBySearchId, updateQueryCollectionLookupInfo, updateQuerySourceLookupInfo,
         fetchSampleSearches, demoQuerySourcesByIds, demoQueryCollectionsByIds, resetSelected, resetQueries,
         resetSentenceCounts, resetSampleStories, resetStoryCounts, resetGeo, updateTimestampForQueries } from '../../../actions/explorerActions';
import QueryBuilderContainer from './QueryBuilderContainer';
import QueryResultsContainer from '../results/QueryResultsContainer';
import { WarningNotice } from '../../common/Notice';
import composeUrlBasedQueryContainer from '../UrlBasedQueryContainer';

const localMessages = {
  errorInURLParams: { id: 'explorer.queryBuilder.urlParams', defaultMessage: 'Your URL query is incomplete. Check the URL and make sure the keyword(s), start and end dates, and collection(s) are properly specified.' },
  register: { id: 'explorer.queryBuilder.urlParams', defaultMessage: 'Register for a free Media Cloud account to get access to all the Dashboard features! <a href="http://tools.mediacloud.org/#/user/signup">Register Now</a>' },
};

class DemoQueryBuilderContainer extends React.Component {
  componentWillMount() {
    const { selectFirstQuery, queries } = this.props;
    // console.log(queries[0]);
    selectFirstQuery(queries[0]);  // on first load select first by default so the builder knows which one to render in the form
  }
  /*
  componentWillUnmount() {
    const { resetExplorerData } = this.props;
    resetExplorerData();
  }
  */
  render() {
    const { queries, handleSearch, samples, location, lastSearchTime } = this.props;
    const isEditable = location.pathname.includes('queries/demo/search');
    return (
      <div className="query-container query-container-demo">
        <WarningNotice><FormattedHTMLMessage {...localMessages.register} />
        </WarningNotice>
        <QueryBuilderContainer isEditable={isEditable} onSearch={() => handleSearch(queries)} />
        <QueryResultsContainer lastSearchTime={lastSearchTime} queries={queries} params={location} samples={samples} />
      </div>
    );
  }
}

DemoQueryBuilderContainer.propTypes = {
  intl: PropTypes.object.isRequired,
  // from parent
  initialValues: PropTypes.object,
  // from state
  location: PropTypes.object,
  selected: PropTypes.object,
  queries: PropTypes.array,
  collectionResults: PropTypes.array,
  collectionLookupFetchStatus: PropTypes.string,
  samples: PropTypes.array,
  query: PropTypes.object,
  handleSearch: PropTypes.func.isRequired,
  lastSearchTime: PropTypes.number,
  setSampleSearch: PropTypes.func.isRequired,
  setSelectedQuery: PropTypes.func.isRequired,
  resetExplorerData: PropTypes.func.isRequired,
  fetchSamples: PropTypes.func.isRequired,
  urlQueryString: PropTypes.string,
  selectFirstQuery: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => ({
  // queryFetchStatus: state.explorer.queries.fetchStatus,
  selected: state.explorer.selected,
  selectedQuery: state.explorer.selected ? state.explorer.selected.q : '',
  queries: state.explorer.queries.queries ? state.explorer.queries.queries : null,
  collectionResults: state.explorer.queries.collections ? state.explorer.queries.collections.results : null,
  collectionLookupFetchStatus: state.explorer.queries.collections.fetchStatus,
  urlQueryString: ownProps.location.pathname,
  lastSearchTime: state.explorer.lastSearchTime.time,
  samples: state.explorer.samples.list,
});

// push any updates (including selected) into queries in state, will trigger async load in sub sections
const mapDispatchToProps = dispatch => ({
  setSelectedQuery: (queryObj) => {
    dispatch(selectQuery(queryObj));
  },
  resetExplorerData: () => { // TODO we will reduce this down to one call
    dispatch(resetSelected());
    dispatch(resetQueries());
    dispatch(resetSentenceCounts());
    dispatch(resetSampleStories());
    dispatch(resetStoryCounts());
    dispatch(resetGeo());
  },
  handleSearch: (queries) => {
    // update URL location according to updated queries
    const unDeletedQueries = queries.filter(q => !q.deleted);
    dispatch(updateTimestampForQueries());
    const nonEmptyQueries = unDeletedQueries.filter(q => q.q !== undefined && q.q !== '');
    const urlParamString = nonEmptyQueries.map((q, idx) => `{"index":${idx},"q":"${encodeURIComponent(q.q)}","color":"${encodeURIComponent(q.color)}"}`);
    const newLocation = `/queries/demo/search/[${urlParamString}]`;
    dispatch(push(newLocation));
  },
  setSampleSearch: (searchObj) => {
    dispatch(selectBySearchId(searchObj));
    searchObj.queries.map((q, idx) => {
      const demoInfo = {
        index: idx,
      };
      if (q.sources && q.sources.length > 0) {
        demoInfo.sources = q.sources.map(src => src.media_id || src.id);
        dispatch(demoQuerySourcesByIds(demoInfo)).then((results) => {
          demoInfo.sources = results;
          dispatch(updateQuerySourceLookupInfo(demoInfo)); // updates the query and the selected query
        });
      }
      if (q.collections && q.collections.length > 0) {
        demoInfo.collections = q.collections.map(coll => coll.tags_id || coll.id);
        dispatch(demoQueryCollectionsByIds(demoInfo))
        .then((results) => {
          demoInfo.collections = results;
          dispatch(updateQueryCollectionLookupInfo(demoInfo)); // updates the query and the selected query
        });
      }
      return 0;
    });
  },
  fetchSamples: () => {
    dispatch(fetchSampleSearches()); // fetch all searches
  },
  selectFirstQuery: (query) => {
    dispatch(selectQuery(query));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeUrlBasedQueryContainer()(
        DemoQueryBuilderContainer
      )
    )
  );
