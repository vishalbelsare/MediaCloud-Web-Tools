import React from 'react';
import { injectIntl } from 'react-intl';
import { reduxForm } from 'redux-form';
import { Row, Col } from 'react-flexbox-grid/lib';
import composeIntlForm from '../../../common/IntlForm';
import AppButton from '../../../common/AppButton';
import CollectionDetailsForm from './CollectionDetailsForm';
import CollectionMediaForm from './CollectionMediaForm';
import SourceList from '../SourceList';
import { emptyString } from '../../../../lib/formValidators';

const localMessages = {
  mainTitle: { id: 'collection.maintitle', defaultMessage: 'Create New Collection' },
  collectionName: { id: 'collection.add.name', defaultMessage: 'New Collection Name' },
  collectionDescription: { id: 'collection.add.description', defaultMessage: 'New Collection Description' },
};

const CollectionForm = (props) => {
  const { initialValues, buttonLabel, pristine, submitting, handleSubmit, onSave } = props;
  let sourceContent = null; // show as editable or not depending on disabled flag
  const submitButton = (
    <AppButton
      type="submit"
      label={buttonLabel}
      disabled={pristine || submitting}
      primary
      className="submit-button"
    />
  );
  if (!initialValues.disabled) {
    sourceContent = (
      <CollectionMediaForm
        initialValues={initialValues}
        submitButton={submitButton}
      />
    );
  } else {
    sourceContent = (
      <SourceList
        collectionId={parseInt(initialValues.id, 10)}
        sources={initialValues.sources}
      />
    );
  }
  return (
    <form className="app-form collection-form" name="collectionForm" onSubmit={handleSubmit(onSave.bind(this))}>
      <CollectionDetailsForm
        initialValues={initialValues}
      />
      {sourceContent}
      <Row>
        <Col lg={10}>
          {submitButton}
        </Col>
      </Row>
    </form>
  );
};

CollectionForm.propTypes = {
  // from parent
  onSave: React.PropTypes.func.isRequired,
  buttonLabel: React.PropTypes.string.isRequired,
  initialValues: React.PropTypes.object,
  // from context
  intl: React.PropTypes.object.isRequired,
  renderTextField: React.PropTypes.func.isRequired,
  renderSelectField: React.PropTypes.func.isRequired,
  collections: React.PropTypes.array,
  // from form healper
  handleSubmit: React.PropTypes.func,
  pristine: React.PropTypes.bool.isRequired,
  submitting: React.PropTypes.bool.isRequired,
};

function validate(values) {
  const errors = {};
  if (emptyString(values.name)) {
    errors.name = localMessages.nameError;
  }
  if (emptyString(values.url)) {
    errors.url = localMessages.urlError;
  }
  return errors;
}

const reduxFormConfig = {
  form: 'collectionForm',
  validate,
};

export default
  injectIntl(
    composeIntlForm(
      reduxForm(reduxFormConfig)(
        CollectionForm
      ),
    ),
  );
