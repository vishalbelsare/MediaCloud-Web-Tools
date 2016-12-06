import React from 'react';
import Title from 'react-title-component';
import { push } from 'react-router-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { createCollection, fetchSourcesByIds, fetchCollectionsByIds } from '../../../actions/sourceActions';
import { updateFeedback } from '../../../actions/appActions';
import CollectionForm from './form/CollectionForm';

const localMessages = {
  mainTitle: { id: 'collection.maintitle', defaultMessage: 'Create New Collection' },
  addButton: { id: 'collection.add.save', defaultMessage: 'Save New Collection' },
  feedback: { id: 'source.add.feedback', defaultMessage: 'We saved your new Collection' },
};

class CreateCollectionContainer extends React.Component {
  componentWillMount() {
    const { location, dispatchMetadataSelections } = this.props;
    if (!location.search) return;
    const hashParts = location.search.split('?');
    const sourcesIdArray = hashParts[1].split('&')[0];
    const collectionsIdArray = hashParts[1].split('&')[1];
    // how to get this from here into initialValues? state or store
    dispatchMetadataSelections(sourcesIdArray, collectionsIdArray);
  }
  render() {
    const { handleSave, goToAdvancedSearch, sourceAdvancedResults, collectionAdvancedResults } = this.props;
    const { formatMessage } = this.props.intl;
    const titleHandler = parentTitle => `${formatMessage(localMessages.mainTitle)} | ${parentTitle}`;
    const initialValues = {
      queriedSources: sourceAdvancedResults,
      queriedCollecitons: collectionAdvancedResults,
    };
    return (
      <div>
        <Title render={titleHandler} />
        <Grid>
          <Row>
            <Col lg={12}>
              <h1><FormattedMessage {...localMessages.mainTitle} /></h1>
            </Col>
          </Row>
          <CollectionForm
            buttonLabel={formatMessage(localMessages.addButton)}
            onSave={handleSave}
            goToAdvancedSearch={goToAdvancedSearch}
            intialValues={initialValues}
          />
        </Grid>
      </div>
    );
  }
}

CreateCollectionContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  // from params (advanced search)
  location: React.PropTypes.object.isRequired,
  // from dispatch
  handleSave: React.PropTypes.func.isRequired,
  goToAdvancedSearch: React.PropTypes.func.isRequired,
  dispatchMetadataSelections: React.PropTypes.func.isRequired,
  sourceAdvancedResults: React.PropTypes.array,
  collectionAdvancedResults: React.PropTypes.array,
};

const mapStateToProps = state => ({
  sourceAdvancedResults: state.sources.sourceSearchByIds.list,
  collectionAdvancedResults: state.sources.collectionSearchByIds.list,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleSave: (values) => {
    const infoToSave = {
      name: values.name,
      description: values.description,
      sources: values.sources.map(s => s.id),
      static: values.static,
    };
    dispatch(createCollection(infoToSave))
      .then((results) => {
        // let them know it worked
        dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(localMessages.feedback) }));
        // TODO: redirect to new source detail page
        dispatch(push(`/collections/${results.tags_id}`));
      });
  },
  goToAdvancedSearch: (values) => {
    dispatch(push(`/collections/create/advancedSearch?${values}`));
  },
  dispatchMetadataSelections: (sourceIdArray, collectionIdArray) => {
    // fields of sources will come back and will be integrated into the media form fields
    if (collectionIdArray && collectionIdArray.length > 0) {
      dispatch(fetchCollectionsByIds(collectionIdArray.split(',')));
    }
    if (sourceIdArray && sourceIdArray.length > 0) {
      dispatch(fetchSourcesByIds(sourceIdArray.split(',')));
    }
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      CreateCollectionContainer
    ),
  );
