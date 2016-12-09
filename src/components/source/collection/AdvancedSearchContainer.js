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
    const { location, dispatchAdvancedSearchStringSelected, dispatchReset } = this.props;
    if (!location.search || location.search === '?') {
      dispatchReset();
      return;
    }
    const hashParts = location.search.split('?');
    const searchString = hashParts[1].split('=')[1];
    // how to get this from here into initialValues? state or store
    dispatchAdvancedSearchStringSelected(searchString);
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
          <SourcesAndCollectionsContainer queriedSources={queriedSources} queriedCollections={queriedCollections} />
        </Grid>
      </div>
    );
  }
}

AdvancedSearchContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  fetchStatus: React.PropTypes.string,
  queriedCollections: React.PropTypes.array,
  queriedSources: React.PropTypes.array,
  dispatchAdvancedSearchStringSelected: React.PropTypes.func,
  dispatchReset: React.PropTypes.func,
  requerySourcesAndCollections: React.PropTypes.func,
  initialValues: React.PropTypes.array,
  location: React.PropTypes.object,
  // from params
  searchString: React.PropTypes.string,
};

const mapStateToProps = state => ({
  searchString: state.sources.selected.advancedSearchString,
  queriedSources: state.sources.selected.sourcesByMetadata.list,
  queriedCollections: state.sources.selected.collectionsByMetadata.list,
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

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      AdvancedSearchContainer
    ),
  );
