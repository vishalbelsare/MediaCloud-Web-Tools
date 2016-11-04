import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import AutoComplete from 'material-ui/AutoComplete';
import { push } from 'react-router-redux';
import { fetchSourceSearch, fetchCollectionSearch } from '../../../actions/sourceActions';

class SourceSearchContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      lastSearchString: '',
    };
  }

  handleNewRequest = (item) => {
    const { navigateToMediaSource, navigateToColleciton } = this.props;
    if (item.type === 'mediaSource') {
      navigateToMediaSource(item.id);
    } else if (item.type === 'collection') {
      navigateToColleciton(item.id);
    }
  }

  shouldFireSearch = (newSearchString) => {
    if (Math.abs(newSearchString.length - this.state.lastSearchString.length) > 2) {
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
    const { sourceResults, collectionResults } = this.props;
    return (
      <div className="source-search">
        <AutoComplete
          hintText="search for media by name or URL"
          fullWidth
          dataSourceConfig={{ text: 'name', value: 'id' }}
          dataSource={sourceResults.concat(collectionResults)}
          onUpdateInput={this.handleUpdateInput}
          onNewRequest={this.handleNewRequest}
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
    dispatch(push(`/source/${id}/details`));
  },
  navigateToColleciton: (id) => {
    dispatch(push(`/collections/${id}/details`));
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
