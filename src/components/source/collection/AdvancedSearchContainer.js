import React from 'react';
import Title from 'react-title-component';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import Divider from 'material-ui/Divider';
import CollectionAdvancedSearchMetadataForm from './form/CollectionAdvancedSearchMetadataForm';
import SourcesAndCollectionsContainer from '../SourcesAndCollectionsContainer';
import { fetchSourceByMetadata, fetchCollectionByMetadata, resetAdvancedSearchSource, resetAdvancedSearchCollection } from '../../../actions/sourceActions';

const localMessages = {
  mainTitle: { id: 'collection.maintitle', defaultMessage: 'Advanced Search' },
  addButton: { id: 'collection.add.save', defaultMessage: 'Search' },
};

class AdvancedSearchContainer extends React.Component {
  componentWillMount() {
    const { saveParamsToStore } = this.props;
    saveParamsToStore(this.props, this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.params.searchStr !== this.props.params.searchStr) {
      const { saveParamsToStore } = nextProps;
      saveParamsToStore(nextProps, this);
    }
  }
  render() {
    const { searchString, queriedSources, queriedCollections, requerySourcesAndCollections } = this.props;
    const { formatMessage } = this.props.intl;
    const titleHandler = parentTitle => `${formatMessage(localMessages.mainTitle)} | ${parentTitle}`;
    let content = null;
    content = (
      <CollectionAdvancedSearchMetadataForm
        initialValues={{ searchString }}
        buttonLabel={formatMessage(localMessages.addButton)}
        requerySourcesAndCollections={requerySourcesAndCollections}
      />
    );
    return (
      <div>
        <Title render={titleHandler} />
        <Grid>
          <Row>
            <Col lg={12}>
              <h1><FormattedMessage {...localMessages.mainTitle} /></h1>
            </Col>
          </Row>
          {content}
          <Divider />
          <SourcesAndCollectionsContainer searchString={searchString} queriedSources={queriedSources} queriedCollections={queriedCollections} />
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

  fetchStatus: React.PropTypes.string,
  queriedCollections: React.PropTypes.array,
  queriedSources: React.PropTypes.array,
  dispatchAdvancedSearchStringSelected: React.PropTypes.func,
  dispatchReset: React.PropTypes.func,
  requerySourcesAndCollections: React.PropTypes.func,
  initialValues: React.PropTypes.array,
  saveParamsToStore: React.PropTypes.func,
  // from state (params)
  searchString: React.PropTypes.string,
};

const mapStateToProps = (state, ownProps) => ({
  searchString: state.sources.selected.advancedSearchString,
  queriedSources: state.sources.selected.sourcesByMetadata.list,
  queriedCollections: state.sources.selected.collectionsByMetadata.list,
  searchStrParam: ownProps.location.query.search,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  requerySourcesAndCollections: (formValues) => {
    let searchStr = formValues.advancedSearchQueryString;
    if (!formValues.advancedSearchQueryString) {
      searchStr = ownProps.searchString;
    }
    // TODO: add support for filtering out static collections, based on `searchStaticCollections` flag
    dispatch(fetchSourceByMetadata(searchStr));
    dispatch(fetchCollectionByMetadata(searchStr));
  },
  dispatchAdvancedSearchStringSelected: (searchString) => {
    dispatch(fetchSourceByMetadata(searchString));
    dispatch(fetchCollectionByMetadata(searchString));
  },
  dispatchReset() {
    dispatch(resetAdvancedSearchSource());
    dispatch(resetAdvancedSearchCollection());
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    saveParamsToStore: () => {
      if (stateProps.searchStrParam) {
        dispatchProps.dispatchAdvancedSearchStringSelected(stateProps.searchStrParam);
      }
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      AdvancedSearchContainer
    ),
  );
