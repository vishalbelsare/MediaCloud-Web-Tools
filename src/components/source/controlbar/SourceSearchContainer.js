import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';
import LoadingSpinner from '../../common/LoadingSpinner';
import { FETCH_ONGOING } from '../../../lib/fetchConstants';
import { fetchSourceSearch, fetchCollectionSearch, resetSourceSearch, resetCollectionSearch } from '../../../actions/sourceActions';

const MAX_SUGGESTION_CHARS = 40;
const MAX_SOURCES_TO_SHOW = 5;
const MAX_COLLECTIONS_TO_SHOW = 3;

const DELAY_BEFORE_SEARCH_MS = 500; // wait this long after a keypress to fire a search

const localMessages = {
  advancedSearch: { id: 'sources.search.advanced', defaultMessage: 'Advanced Search...' },
  searchHint: { id: 'sources.search.hint', defaultMessage: 'Search for sources or collections' },
};

class SourceSearchContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      lastSearchString: '',
      lastKeypress: 0,
      searchTimeout: null,
    };
  }

  handleClick = (item) => {
    const { onMediaSourceSelected, onCollectionSelected, onAdvancedSearchSelected } = this.props;
    const { formatMessage } = this.props.intl;
    const advancedSearchTitle = formatMessage(localMessages.advancedSearch);

    if (item) {
      if (item.type === 'mediaSource') {
        if (onMediaSourceSelected) onMediaSourceSelected(item);
      } else if (item.type === 'collection') {
        if (onCollectionSelected) onCollectionSelected(item);
      } else if (item === advancedSearchTitle) {
        if (onAdvancedSearchSelected) onAdvancedSearchSelected(this.state.lastSearchString);
      }
    }
  }

  fireSearchIfNeeded = () => {
    const { search } = this.props;
    const shouldSearch = this.state.lastSearchString.length > 3;
    if (shouldSearch) {
      search(this.state.lastSearchString);
    }
  }

  resetIfRequested = () => {
    const { sourceResults, collectionResults, searchSources, searchCollections, onAdvancedSearchSelected, disableStaticCollections } = this.props;
    const { formatMessage } = this.props.intl;
    let results = [];

    const advancedSearchTitle = formatMessage(localMessages.advancedSearch);
    if (searchCollections || searchCollections === undefined) {
      results = results.concat(collectionResults.slice(0, MAX_COLLECTIONS_TO_SHOW));
    }
    if (searchSources || searchSources === undefined) {
      results = results.concat(sourceResults.slice(0, MAX_SOURCES_TO_SHOW));
    }
    let resultsAsComponents = results.map((item) => {
      let menuItemValue = (
        <MenuItem
          onClick={() => this.handleClick(item)}
          id={`searchResult${item.media_id || item.tags_id}`}
          primaryText={(item.name.length > MAX_SUGGESTION_CHARS) ? `${item.name.substr(0, MAX_SUGGESTION_CHARS)}...` : item.name}
        />
      );
      if (disableStaticCollections && item.is_static === 1) {
        menuItemValue = (
          <MenuItem
            id={`searchResult${item.media_id || item.tags_id}`}
            primaryText={(item.name.length > MAX_SUGGESTION_CHARS) ? `${item.name.substr(0, MAX_SUGGESTION_CHARS)}...` : `${item.name} is static and cannot be added`}
            style={{ color: '#aaaaaa' }}
            disabled
          />
        );
      }
      return ({
        text: item.name,
        value: menuItemValue,
      });
    });

    if (onAdvancedSearchSelected !== undefined) {
      resultsAsComponents = resultsAsComponents.concat({
        text: 'Advanced Search',
        key: 'Advanced Search',
        value: <MenuItem
          value={advancedSearchTitle}
          onClick={() => this.handleClick(advancedSearchTitle)}
          primaryText={formatMessage(localMessages.advancedSearch)}
        />,
      });
    }
    return resultsAsComponents;
  }

  handleUpdateInput = (searchString) => {
    clearTimeout(this.state.searchTimeout); // cancel any pending searches
    this.setState({
      lastSearchString: searchString,
      searchTimeout: setTimeout(this.fireSearchIfNeeded, DELAY_BEFORE_SEARCH_MS),  // schedule a search for when they stop typing
    });
  }

  handleNewRequest = (searchString, index) => {
    const { search } = this.props;
    if (index === -1) { // they pressed enter in the text field
      search(searchString);
    }
    // else: they clicked an item and it will take care of things itself
  }

  render() {
    const { sourceFetchStatus, collectionFetchStatus } = this.props;
    const { formatMessage } = this.props.intl;
    const resultsAsComponents = this.resetIfRequested();
    const isFetching = (sourceFetchStatus === FETCH_ONGOING) || (collectionFetchStatus === FETCH_ONGOING);
    const fetchingStatus = (isFetching) ? <LoadingSpinner size={15} /> : null;
    return (
      <div className="source-search">
        <div className="fetching">{fetchingStatus}</div>
        <AutoComplete
          hintText={formatMessage(localMessages.searchHint)}
          fullWidth
          openOnFocus
          onClick={this.resetIfRequested}
          dataSource={resultsAsComponents}
          onUpdateInput={this.handleUpdateInput}
          onNewRequest={this.handleNewRequest}
          maxSearchResults={10}
          filter={() => true}
        />
      </div>
    );
  }

}

SourceSearchContainer.propTypes = {
  intl: React.PropTypes.object.isRequired,
  // from parent
  searchSources: React.PropTypes.bool,      // include source results?
  searchCollections: React.PropTypes.bool,  // include collection results?
  searchStaticCollections: React.PropTypes.bool,  // inclue static collecton results?
  onMediaSourceSelected: React.PropTypes.func,
  onCollectionSelected: React.PropTypes.func,
  onAdvancedSearchSelected: React.PropTypes.func,
  // from state
  sourceFetchStatus: React.PropTypes.array.isRequired,
  collectionFetchStatus: React.PropTypes.array.isRequired,
  sourceResults: React.PropTypes.array.isRequired,
  collectionResults: React.PropTypes.array.isRequired,
  // from dispatch
  search: React.PropTypes.func.isRequired,
  disableStaticCollections: React.PropTypes.bool,
};

const mapStateToProps = state => ({
  sourceFetchStatus: state.sources.search.simple.sources.fetchStatus,
  collectionFetchStatus: state.sources.search.simple.collections.fetchStatus,
  sourceResults: state.sources.search.simple.sources.list,
  collectionResults: state.sources.search.simple.collections.list,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  search: (searchString) => {
    // TODO: add support for filtering out static collections, based on `searchStaticCollections` flag
    // handle the situation where you are searching for just collections and NOT sources
    const searchCollections = (ownProps.searchCollections === undefined) || (ownProps.searchCollections === true);
    const searchSources = (ownProps.searchSources === undefined) || (ownProps.searchSources === true);
    if (!searchSources) {
      dispatch(resetSourceSearch());
    } else {
      dispatch(fetchSourceSearch(searchString));
    }
    if (!searchCollections) {
      dispatch(resetCollectionSearch());
    } else {
      dispatch(fetchCollectionSearch(searchString));
    }
  },
});

SourceSearchContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
};

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      SourceSearchContainer
    )
  );
