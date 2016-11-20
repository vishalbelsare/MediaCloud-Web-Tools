import React from 'react';
import Title from 'react-title-component';
import { FormattedMessage } from 'react-intl';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import MenuItem from 'material-ui/MenuItem';
import composeIntlForm from '../../../common/IntlForm';
import CollectionAddMediaContainer from './CollectionAddMediaContainer';
import SourceSearchContainer from '../../controlbar/SourceSearchContainer';
import SourceTable from '../../SourceTable';
import { createCollection, addSourcesToCollection } from '../../../../actions/sourceActions';
import AppButton from '../../../common/AppButton';


const localMessages = {
  mainTitle: { id: 'collection.maintitle', defaultMessage: 'Create New Collection' },
  collectionName: { id: 'collection.add.name', defaultMessage: 'New Collection Name' },
  collectionDescription: { id: 'collection.add.description', defaultMessage: 'New Collection Description' },
  addButton: { id: 'collection.add.saveAll', defaultMessage: 'Save New Collection' },
  static: { id: 'collection.add.static', defaultMessage: 'Static?' },
  yes: { id: 'collection.add.static.yes', defaultMessage: 'Yes' },
  no: { id: 'collection.add.static.no', defaultMessage: 'No' },
};

const CreateCollectionContainer = (props) => {
  const { handleSubmit, handleSave, extHandleClick, sources } = props;
  const { renderTextField, renderSelectField } = props;
  const { formatMessage } = props.intl;
  const titleHandler = formatMessage(localMessages.mainTitle);
  const buttonLabel = formatMessage(localMessages.addButton);
  const CREATE_STATIC = 0;
  const CREATE_NOT_STATIC = 1;
  return (
    <div>
      <Title render={titleHandler} />
      <Grid>
        <Row>
          <Col lg={12}>
            <h1><FormattedMessage {...localMessages.mainTitle} /></h1>
          </Col>
        </Row>
        <form name="collectionCreateForm" onSubmit={handleSubmit(handleSave.bind(this))}>
          <Row>
            <Col lg={5} md={5} sm={5}>
              <h3><FormattedMessage {...localMessages.collectionName} /></h3>
            </Col>
            <Col lg={5} md={5} sm={12}>
              <Field
                name="collectionName"
                component={renderTextField}
                fullWidth
                floatingLabelText={localMessages.collectionName}
              />
            </Col>
          </Row>
          <Row>
            <Col lg={5} md={5} sm={5}>
              <h3><FormattedMessage {...localMessages.collectionDescription} /></h3>
            </Col>
            <Col lg={5} md={5} sm={12}>
              <Field
                name="collectionDescription"
                component={renderTextField}
                fullWidth
                floatingLabelText={localMessages.collectionDescription}
              />
            </Col>
          </Row>
          <Row>
            <Col lg={5} md={5} sm={5}>
              <h3><FormattedMessage {...localMessages.static} /></h3>
            </Col>
            <Col lg={3} md={3} sm={3} xs={12}>
              <Field name="static" component={renderSelectField} floatingLabelText={localMessages.static}>
                <MenuItem key="static" value={CREATE_STATIC} primaryText={formatMessage(localMessages.yes)} />
                <MenuItem key="not_static" value={CREATE_NOT_STATIC} primaryText={formatMessage(localMessages.no)} />
              </Field>
            </Col>
          </Row>
          <CollectionAddMediaContainer onSave={handleSave} />
          <SourceSearchContainer onClick={extHandleClick} />
          <SourceTable sources={sources} />
          <AppButton
            style={{ marginTop: 30 }}
            type="submit"
            label={buttonLabel}
            primary
          />
        </form>
      </Grid>
    </div>
  );
};

CreateCollectionContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  handleSave: React.PropTypes.func.isRequired,
  handleSubmit: React.PropTypes.func.isRequired,
  extHandleClick: React.PropTypes.func.isRequired,
  renderTextField: React.PropTypes.func.isRequired,
  renderSelectField: React.PropTypes.func.isRequired,
  sources: React.PropTypes.array,
  // from state
};

function validate() {
  const errors = {};
  // TODO: figure out if we need to do more validation here, because in theory the
  // subforms components have already done it
  return errors;
}

const reduxFormConfig = {
  form: 'collectionCreateForm', // make sure this matches the sub-components and other wizard steps
  validate,
};


const mapStateToProps = state => ({
  fetchStatus: state.sources.selected.details.collection.collectionCreate.sourceSearch.fetchStatus,
  sources: state.sources.selected.details.collectionCreate.attachedSources.sources,
});

const mapDispatchToProps = dispatch => ({
  handleSave: (values) => {
    const newVals = Object.assign({}, values, {
      sourceObj: [{ name: values.sourceName, url: values.sourceUrl }] });
    dispatch(createCollection(newVals));
   // .then(() => dispatch(createCollection(ownProps.collectionId)));
  },
  extHandleClick: (item) => {
    dispatch(addSourcesToCollection(item));
  },
});

export default
  composeIntlForm(
    reduxForm(reduxFormConfig)(
      connect(mapStateToProps, mapDispatchToProps)(
        CreateCollectionContainer
      ),
    ),
  );
