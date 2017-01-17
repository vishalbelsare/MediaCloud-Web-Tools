import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid } from 'react-flexbox-grid/lib';
import { push } from 'react-router-redux';
import composeAsyncContainer from '../../common/AsyncContainer';
import AdvancedSearchResults from './AdvancedSearchResults';
import { fetchSourceByMetadata, fetchCollectionByMetadata,
  selectAdvancedSearchCollection, selectAdvancedSearchSource } from '../../../actions/sourceActions';

const ADD_ALL_THIS_PAGE = 1;
const REMOVE_ALL = 0;
const ADD_ALL_PAGES = 2;

// TODO when paging is implemented, we'll have to set these booleans...
const FIRST_PAGE = true;

class AdvancedSearchResultsContainer extends React.Component {
  componentDidMount = () => {
    this.setState({ allOrNoneCheck: false });
  }
  componentWillReceiveProps(nextProps) {
    const { searchString, tags, fetchData } = this.props;
    if ((nextProps.searchString !== searchString) || (nextProps.tags !== tags)) {
      fetchData(nextProps.searchString, nextProps.tags);
    }
  }
  addOrRemoveToSelectedSources= (mediaId, checked) => {
    const { dispatchSourceSelection } = this.props;
    dispatchSourceSelection([mediaId], checked);
  };
  addOrRemoveToSelectedCollections = (tagId, checked) => {
    const { dispatchCollectionSelection } = this.props;
    dispatchCollectionSelection([tagId], checked);
  };
  evalStateAndPage = () => {
    if (this.state &&
      (this.state.allOrNoneCheck === ADD_ALL_PAGES ||
      (this.state.allOrNoneCheck === ADD_ALL_THIS_PAGE && FIRST_PAGE))) {
      return true;
    }
    return false;
  };
  addOrRemoveAllSelected = (values) => {
    const { dispatchSourceSelection, dispatchCollectionSelection } = this.props;
    this.setState({ allOrNoneCheck: values });
    // if values == ADD_ALL_THIS_PAGE, REMOVE_ALL, ADD_ALL_PAGES

    // values ADD_ALL_THIS_PAGE or ADD_ALL_PAGES will select appropriate
    dispatchSourceSelection([], values);
    dispatchCollectionSelection([], values);
    // dispatch a click to all the checkboxes to checked somehow
  };
  pushToCreateCollectionPage = () => {
    const { searchString, queriedSources, queriedCollections, dispatchToCreate, dispatchToCreateWithSearch } = this.props;
    if (this.state && this.state.allOrNoneCheck === ADD_ALL_PAGES) {
      dispatchToCreateWithSearch(searchString);
    } else {
      dispatchToCreate(queriedSources, queriedCollections);
    }
  };
  render() {
    const { queriedSources, queriedCollections } = this.props;
    return (
      <Grid>
        <AdvancedSearchResults
          onAddToCollection={this.pushToCreateCollectionPage}
          queriedSources={queriedSources}
          queriedCollections={queriedCollections}
          addRemoveAll={this.addOrRemoveAllSelected}
          ADD_ALL_THIS_PAGE={ADD_ALL_THIS_PAGE}
          REMOVE_ALL={REMOVE_ALL}
          ADD_ALL_PAGES={ADD_ALL_PAGES}
          allOrNoneCheck={this.evalStateAndPage()}
          addOrRemoveToSelectedSources={this.addOrRemoveToSelectedSources}
          addOrRemoveToSelectedCollections={this.addOrRemoveToSelectedCollections}
        />
      </Grid>
    );
  }
}

AdvancedSearchResultsContainer.propTypes = {
  // from state
  queriedCollections: React.PropTypes.array,
  queriedSources: React.PropTypes.array,
  fetchStatus: React.PropTypes.string.isRequired,
  // from context
  intl: React.PropTypes.object.isRequired,
  // form parent
  searchString: React.PropTypes.string,
  tags: React.PropTypes.array,
  // from dispatch
  dispatchToCreate: React.PropTypes.func.isRequired,
  dispatchSourceSelection: React.PropTypes.func.isRequired,
  dispatchCollectionSelection: React.PropTypes.func.isRequired,
  dispatchToCreateWithSearch: React.PropTypes.func.isRequired,
  dispatchReset: React.PropTypes.func,
  fetchData: React.PropTypes.func.isRequired,
  asyncFetch: React.PropTypes.func.isRequired,
  // from form healper
  buttonLabel: React.PropTypes.string,
  initialValues: React.PropTypes.object,
  handleSubmit: React.PropTypes.func,
  pristine: React.PropTypes.bool,
  submitting: React.PropTypes.bool,
};

const mapStateToProps = state => ({
  fetchStatus: state.sources.search.advanced.collections.fetchStatus,
  queriedSources: state.sources.search.advanced.sources.list,
  queriedCollections: state.sources.search.advanced.collections.list,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (searchString, tags) => {
    dispatch(fetchSourceByMetadata({ searchString, tags }));
    dispatch(fetchCollectionByMetadata(searchString));
  },
  asyncFetch: () => {
    dispatch(fetchSourceByMetadata({ searchString: ownProps.searchString, tags: ownProps.tags }));
    dispatch(fetchCollectionByMetadata(ownProps.searchString));
  },
  // depending on checked value, all or page or a selected set or no items are to be selected
  dispatchSourceSelection: (mediaId, checked) => {
    dispatch(selectAdvancedSearchSource({ ids: mediaId.length > 0 ? mediaId : [], checked }));
  },
  dispatchCollectionSelection: (tagId, checked) => {
    dispatch(selectAdvancedSearchCollection({ ids: tagId.length > 0 ? tagId : [], checked }));
  },
  dispatchToCreateWithSearch: (searchStr) => {
    const url = `/collections/create?search=${searchStr}`;
    dispatch(push(url));
  },
  dispatchToCreate: (sources, collections) => {
    // get all ids and push them into url params
    const srcIdArray = sources.map((s) => {
      if (s.selected === true) {
        return s.media_id;
      }
      return null;
    }).filter(i => i !== null);

    const collIdArray = collections.map((s) => {
      if (s.selected === true) {
        return s.tags_id;
      }
      return null;
    }).filter(i => i !== null);

    const params = srcIdArray.join(',');
    const collparams = collIdArray.join(',');
    let url = '/collections/create';
    if (srcIdArray.length > 0) {
      url += `?src=${params}`;
      if (collIdArray.length > 0) {
        url += `&coll=${collparams}`;
      }
    }
    if (srcIdArray.length === 0 && collIdArray.length > 0) {
      url += `?coll=${collparams}`;
    }
    dispatch(push(url));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeAsyncContainer(
        AdvancedSearchResultsContainer
      )
    )
  );
