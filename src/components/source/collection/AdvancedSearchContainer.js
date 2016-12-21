import React from 'react';
import Title from 'react-title-component';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import Divider from 'material-ui/Divider';
import composeAsyncContainer from '../../common/AsyncContainer';
import CollectionAdvancedSearchMetadataForm from './form/CollectionAdvancedSearchMetadataForm';
import SourcesAndCollectionsContainer from '../SourcesAndCollectionsContainer';
import { fetchSourceByMetadata, fetchCollectionByMetadata, resetAdvancedSearchSource, resetAdvancedSearchCollection } from '../../../actions/sourceActions';

const localMessages = {
  mainTitle: { id: 'collection.maintitle', defaultMessage: 'Advanced Search' },
  addButton: { id: 'collection.add.save', defaultMessage: 'Search' },
};

class AdvancedSearchContainer extends React.Component {

  componentWillReceiveProps(nextProps) {
    if (nextProps.advancedSearchQueryString !== this.props.advancedSearchQueryString) {
      const { searchOrReset } = nextProps;
      searchOrReset(nextProps.advancedSearchQueryString, this);
    }
  }
  componentWillUnmount() {
    const { searchOrReset } = this.props;
    searchOrReset();
  }
  render() {
    const { searchString, advancedSearchQueryString, queriedSources, queriedCollections, requerySourcesAndCollections } = this.props;
    const { formatMessage } = this.props.intl;
    const titleHandler = parentTitle => `${formatMessage(localMessages.mainTitle)} | ${parentTitle}`;
    const searchContent = (
      <CollectionAdvancedSearchMetadataForm
        initialValues={{ advancedSearchQueryString }}
        buttonLabel={formatMessage(localMessages.addButton)}
        requerySourcesAndCollections={requerySourcesAndCollections}
      />
    );
    let resultsContent = null;
    if ((queriedSources !== undefined && queriedSources.length > 0) ||
      (queriedCollections !== undefined && queriedCollections.length > 0)) {
      resultsContent = (
        <SourcesAndCollectionsContainer searchString={searchString} queriedSources={queriedSources} queriedCollections={queriedCollections} />
      );
    }
    return (
      <div>
        <Title render={titleHandler} />
        <Grid>
          <Row>
            <Col lg={12}>
              <h1><FormattedMessage {...localMessages.mainTitle} /></h1>
            </Col>
          </Row>
          {searchContent}
          <Divider />
          {resultsContent}
        </Grid>
      </div>
    );
  }
}

AdvancedSearchContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  params: React.PropTypes.object.isRequired,       // params from router
  location: React.PropTypes.object,

  // from dispatch
  asyncFetch: React.PropTypes.func.isRequired,
  fetchStatus: React.PropTypes.string,
  queriedCollections: React.PropTypes.array,
  queriedSources: React.PropTypes.array,
  dispatchAdvancedSearchStringSelected: React.PropTypes.func,
  dispatchReset: React.PropTypes.func,
  requerySourcesAndCollections: React.PropTypes.func,
  initialValues: React.PropTypes.array,
  searchOrReset: React.PropTypes.func,
  // from state (params)
  searchString: React.PropTypes.string,
  // from url
  advancedSearchQueryString: React.PropTypes.string,
};

const mapStateToProps = (state, ownProps) => ({
  fetchStatus: state.sources.selected.sourcesByMetadata.fetchStatus,
  resetResult: state.sources.selected.sourcesByMetadata.reset,
  searchString: state.sources.selected.advancedSearchString,
  queriedSources: state.sources.selected.sourcesByMetadata.list,
  queriedCollections: state.sources.selected.collectionsByMetadata.list,
  advancedSearchQueryString: ownProps.location.query.search,
});

// helper to fire off event
function dispatchAdvancedSearchStringSelected(dispatch, searchString) {
  dispatch(fetchSourceByMetadata(searchString));
  dispatch(fetchCollectionByMetadata(searchString));
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  requerySourcesAndCollections: (formValues) => {
    let searchStr = formValues.advancedSearchQueryString;
    if (!formValues.advancedSearchQueryString) {
      searchStr = ownProps.searchString;
    }
    // TODO: add support for filtering out static collections, based on `searchStaticCollections` flag
    dispatchAdvancedSearchStringSelected(dispatch, searchStr);
  },
  searchOrReset: (searchStr) => {
    // TODO: add support for filtering out static collections, based on `searchStaticCollections` flag
    if (searchStr) {
      dispatchAdvancedSearchStringSelected(dispatch, searchStr);
    } else {
      dispatch(resetAdvancedSearchSource());
      dispatch(resetAdvancedSearchCollection());
    }
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.searchOrReset(ownProps.advancedSearchQueryString ? ownProps.advancedSearchQueryString : ownProps.location.query.search);
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      composeAsyncContainer(
        AdvancedSearchContainer
      )
    ),
  );
