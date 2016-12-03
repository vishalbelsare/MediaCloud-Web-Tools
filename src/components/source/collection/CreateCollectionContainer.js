import React from 'react';
import Title from 'react-title-component';
import { push } from 'react-router-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { createCollection } from '../../../actions/sourceActions';
import { updateFeedback } from '../../../actions/appActions';
import CollectionForm from './form/CollectionForm';

const localMessages = {
  mainTitle: { id: 'collection.maintitle', defaultMessage: 'Create New Collection' },
  addButton: { id: 'collection.add.save', defaultMessage: 'Save New Collection' },
  feedback: { id: 'source.add.feedback', defaultMessage: 'We saved your new Collection' },
};

const CreateCollectionContainer = (props) => {
  const { handleSave, goToAdvancedSearch } = props;
  const { formatMessage } = props.intl;
  const titleHandler = parentTitle => `${formatMessage(localMessages.mainTitle)} | ${parentTitle}`;
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
        />
      </Grid>
    </div>
  );
};

CreateCollectionContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  // from dispatch
  handleSave: React.PropTypes.func.isRequired,
  goToAdvancedSearch: React.PropTypes.func.isRequired,
};

const mapStateToProps = () => ({
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
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      CreateCollectionContainer
    ),
  );
