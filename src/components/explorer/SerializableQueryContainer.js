import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { schemeCategory10 } from 'd3';
import LoadingSpinner from '../common/LoadingSpinner';
import { LEVEL_ERROR } from '../common/Notice';
import { addNotice } from '../../actions/appActions';
import { selectBySearchParams, updateQuerySourceLookupInfo, updateQueryCollectionLookupInfo,
  fetchQuerySourcesByIds, fetchQueryCollectionsByIds } from '../../actions/explorerActions';
import { FETCH_INVALID, FETCH_SUCCEEDED } from '../../lib/fetchConstants';
import { autoMagicQueryLabel } from './builder/QueryPicker';

const localMessages = {
  errorInURLParams: { id: 'explorer.queryBuilder.urlParams',
    defaultMessage: 'Your URL query is incomplete. Check the URL and make sure the keyword(s), start and end dates, and collection(s) are properly specified.' },
};


/**
 * Only render the widget once we've pared the query from the URL - complicated because we do an async fetch
 * to get source and collection details from the server.
 */
function composeSerializableQueryContainer() {
  return (ChildComponent) => {
    class SerializableQueryContainer extends React.Component {
      state = {
        queryInStore: false,
      };
      componentWillMount() {
        this.setQueryFromUrl(this.props.location.pathname);
        // console.log('parse from url');
      }
      componentWillReceiveProps(nextProps) {
        const { location } = this.props;
        // console.log('new props');
        // if URL has been updated, reparse and store
        if (nextProps.location.pathname !== location.pathname) {
          this.setState({ queryInStore: false }); // show spinner while parsing and loading query
          // console.log('  url change');
          this.setQueryFromUrl(nextProps.location.pathname);
        } else if (this.state.queryInStore === false) {   // make sure to only do this once
          // console.log('  waiting for media info from server');
          // mark the whole thing as ready once any sources and collections have been set
          const readyFetchStatusStates = [FETCH_INVALID, FETCH_SUCCEEDED];
          if (readyFetchStatusStates.includes(nextProps.collectionsFetchStatus) &&
              readyFetchStatusStates.includes(nextProps.sourcesFetchStatus)) {
            // console.log('  got media info from server, ready!');
            this.setState({ queryInStore: true });  // mark that the parsing process has finished
          }
        } else {
          // console.log('  other change');
        }
      }
      setQueryFromUrl(url) {
        const { addAppNotice, saveQueriesFromParsedUrl } = this.props;
        const { formatMessage } = this.props.intl;
        const queryAsJsonStr = url.slice(url.lastIndexOf('/') + 1, url.length);
        let queriesFromUrl;
        try {
          queriesFromUrl = JSON.parse(queryAsJsonStr);
        } catch (e) {
          addAppNotice({ level: LEVEL_ERROR, message: formatMessage(localMessages.errorInURLParams) });
          return;
        }
        // add in an index, label, and color if they are not there
        queriesFromUrl = queriesFromUrl.map((query, index) => ({
          label: autoMagicQueryLabel(query),
          color: schemeCategory10[index % 10],
          ...query, // let anything on URL override label and color
          index,  // redo index to be zero-based on reload of query
        }));
        saveQueriesFromParsedUrl(queriesFromUrl); // push the queries in to the store
      }
      render() {
        let content;
        if (this.state.queryInStore) {
          content = <ChildComponent {...this.props} />;
        } else {
          content = <LoadingSpinner />;
        }
        return (
          <div className="serializable-query">
            {content}
          </div>
        );
      }
    }

    SerializableQueryContainer.propTypes = {
      intl: PropTypes.object.isRequired,
      location: React.PropTypes.object,
      // from store
      collectionsFetchStatus: React.PropTypes.string,
      sourcesFetchStatus: React.PropTypes.string,
      // from dispatch
      saveQueriesFromParsedUrl: PropTypes.func.isRequired,
      addAppNotice: PropTypes.func.isRequired,
    };

    const mapStateToProps = state => ({
      collectionsFetchStatus: state.explorer.queries.collections.fetchStatus,  // prefetch status for collections
      sourcesFetchStatus: state.explorer.queries.sources.fetchStatus,  // prefetch status for sources
    });

    // push any updates (including selected) into queries in state, will trigger async load in sub sections
    const mapDispatchToProps = dispatch => ({
      addAppNotice: (info) => {
        dispatch(addNotice(info));
      },
      saveQueriesFromParsedUrl: (queryArrayFromURL) => {
        dispatch(selectBySearchParams(queryArrayFromURL)); // load query data into queries
        // lookup ancillary data eg collection and source info for display purposes in QueryForm
        queryArrayFromURL.forEach((q) => {
          const queryInfo = {
            ...q,
          };
          if (q.sources && q.sources.length > 0) {
            queryInfo.sources = q.sources.map(src => src.media_id || src.id);
            dispatch(fetchQuerySourcesByIds(queryInfo))
            .then((results) => {
              queryInfo.sources = results;
              dispatch(updateQuerySourceLookupInfo(queryInfo)); // updates the query and the selected query
            });
          }
          if (q.collections && q.collections.length > 0) {
            queryInfo.collections = q.collections.map(coll => coll.tags_id || coll.id);
            dispatch(fetchQueryCollectionsByIds(queryInfo))
            .then((results) => {
              queryInfo.collections = results;
              dispatch(updateQueryCollectionLookupInfo(queryInfo)); // updates the query and the selected query
            });
          }
        });
      },
    });

    return injectIntl(
      connect(mapStateToProps, mapDispatchToProps)(
        SerializableQueryContainer
      )
    );
  };
}

export default composeSerializableQueryContainer;
