import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import AutoComplete from 'material-ui/AutoComplete';
import { push } from 'react-router-redux';
import { fetchSourceSearch } from '../../../actions/sourceActions';

class SourceSearchContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      lastSearchString: '',
    };
  }

  handleNewRequest = (mediaSource) => {
    const { navigateToMediaSource } = this.props;
    navigateToMediaSource(mediaSource.media_id);
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
    const { searchResults } = this.props;
    return (
      <div className="source-search">
        <AutoComplete
          hintText="search for media by name or URL"
          fullWidth
          dataSourceConfig={{ text: 'name', value: 'media_id' }}
          dataSource={searchResults}
          onUpdateInput={this.handleUpdateInput}
          onNewRequest={this.handleNewRequest}
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
  searchResults: React.PropTypes.array.isRequired,
  // from dispatch
  search: React.PropTypes.func.isRequired,
  navigateToMediaSource: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  searchResults: state.sources.sourceSearch.list,
});

const mapDispatchToProps = (dispatch) => ({
  search: (searchString) => {
    dispatch(fetchSourceSearch(searchString));
  },
  navigateToMediaSource: (mediaId) => {
    dispatch(push(`/source/${mediaId}/details`));
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
