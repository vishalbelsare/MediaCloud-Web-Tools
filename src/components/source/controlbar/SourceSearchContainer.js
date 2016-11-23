import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import AutoComplete from 'material-ui/AutoComplete';
import { push } from 'react-router-redux';
import MenuItem from 'material-ui/MenuItem';
import { fetchSourceSearch, fetchCollectionSearch } from '../../../actions/sourceActions';

const MAX_SUGGESTION_CHARS = 40;

class SourceSearchContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      lastSearchString: '',
    };
  }

  handleClick = (item) => {
    const { navigateToMediaSource, navigateToColleciton } = this.props;
    if (item.type === 'mediaSource') {
      navigateToMediaSource(item.id);
    } else if (item.type === 'collection') {
      navigateToColleciton(item.id);
    }
  }

  shouldFireSearch = (newSearchString) => {
    if ((newSearchString.length > 0) &&
        (newSearchString !== this.state.lastSearchString) &&
        Math.abs(newSearchString.length - this.state.lastSearchString.length) > 2) {
      this.setState({ lastSearchString: newSearchString });
      return true;
    }
    return false;
  }

  handleUpdateInput = (searchString) => {
    const { search } = this.props;
    if (this.shouldFireSearch(searchString)) {
      search(searchString);
    }
  }

  filterResults = () => true

  render() {
    const { sourceResults, collectionResults, onClick } = this.props;
    const results = sourceResults.concat(collectionResults);
    const resultsAsComponents = results.map(item => ({
      text: item.name,
      value: (
        <MenuItem
          onClick={() => (onClick ? onClick(item) : this.handleClick(item))}
          primaryText={(item.name.length > MAX_SUGGESTION_CHARS) ? `${item.name.substr(0, MAX_SUGGESTION_CHARS)}...` : item.name}
        />
      ),
    }));
    return (
      <div className="source-search">
        <AutoComplete
          hintText="search for media by name or URL"
          fullWidth
          openOnFocus
          dataSource={resultsAsComponents}
          onUpdateInput={this.handleUpdateInput}
          maxSearchResults={10}
          filter={this.filterResults}
        />
      </div>
    );
  }

}

SourceSearchContainer.propTypes = {
  intl: React.PropTypes.object.isRequired,
  // form state
  sourceResults: React.PropTypes.array.isRequired,
  collectionResults: React.PropTypes.array.isRequired,
  // from dispatch
  search: React.PropTypes.func.isRequired,
  navigateToMediaSource: React.PropTypes.func.isRequired,
  navigateToColleciton: React.PropTypes.func.isRequired,
  onClick: React.PropTypes.func,
};

const mapStateToProps = state => ({
  sourceResults: state.sources.sourceSearch.list,
  collectionResults: state.sources.collectionSearch.list,
});

const mapDispatchToProps = dispatch => ({
  search: (searchString) => {
    dispatch(fetchSourceSearch(searchString));
    dispatch(fetchCollectionSearch(searchString));
  },
  navigateToMediaSource: (id) => {
    dispatch(push(`/sources/${id}`));
  },
  navigateToColleciton: (id) => {
    dispatch(push(`/collections/${id}`));
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
