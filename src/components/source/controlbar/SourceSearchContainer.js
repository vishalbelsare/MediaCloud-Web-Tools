import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';
import { fetchSourceSearch, fetchCollectionSearch, resetSourceSearch, resetCollectionSearch } from '../../../actions/sourceActions';

const MAX_SUGGESTION_CHARS = 40;

const localMessages = {
  advancedSearch: { id: 'sourceCollectionList.search', defaultMessage: 'Advanced Search...' },
};


class SourceSearchContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      lastSearchString: '',
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

  shouldFireSearch = (newSearchString) => {
    if (((newSearchString.length > 0) &&
        (newSearchString !== this.state.lastSearchString)) ||
        ((newSearchString === this.state.lastSearchString) &&
          (Math.abs(newSearchString.length - this.state.lastSearchString.length) > 2))) {
      this.setState({ lastSearchString: newSearchString });
      return true;
    }
    return false;
  }

  resetIfRequested = () => {
    const { sourceResults, collectionResults, searchSources, searchCollections, onAdvancedSearchSelected } = this.props;
    const { formatMessage } = this.props.intl;
    let results = [];
    const advancedSearchTitle = formatMessage(localMessages.advancedSearch);
    if (searchSources || searchSources === undefined) {
      results = results.concat(sourceResults);
    }
    if (searchCollections || searchCollections === undefined) {
      results = results.concat(collectionResults);
    }
    let resultsAsComponents = results.map(item => ({
      text: item.name,
      value: (
        <MenuItem
          onClick={() => this.handleClick(item)}
          primaryText={(item.name.length > MAX_SUGGESTION_CHARS) ? `${item.name.substr(0, MAX_SUGGESTION_CHARS)}...` : item.name}
        />
      ),
    }));

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
    const { search } = this.props;
    if (this.shouldFireSearch(searchString)) {
      search(searchString);
    }
  }

  render() {
    const resultsAsComponents = this.resetIfRequested();
    return (
      <div className="source-search">
        <AutoComplete
          hintText="search for media by name or URL"
          fullWidth
          openOnFocus
          onClick={this.resetIfRequested}
          dataSource={resultsAsComponents}
          onUpdateInput={this.handleUpdateInput}
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
  sourceResults: React.PropTypes.array.isRequired,
  collectionResults: React.PropTypes.array.isRequired,
  // from dispatch
  search: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  sourceResults: state.sources.sourceSearch.list,
  collectionResults: state.sources.collectionSearch.list,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  search: (searchString) => {
    // TODO: add support for filtering out static collections, based on `searchStaticCollections` flag
    if ((ownProps.searchCollections === undefined) || (ownProps.searchCollections === true)) {
      dispatch(resetSourceSearch());
      dispatch(fetchCollectionSearch(searchString));
    }
    if ((ownProps.searchSources === undefined) || (ownProps.searchSources === true)) {
      dispatch(resetCollectionSearch());
      dispatch(fetchSourceSearch(searchString));
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
