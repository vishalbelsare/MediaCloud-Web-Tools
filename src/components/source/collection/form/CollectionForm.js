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
  let enabledContent = null;
  let disabledContent = null;

  if (!initialValues.disabled) {
    enabledContent = (
      <CollectionMediaForm
        initialValues={initialValues}
      />
    );
  } else {
    disabledContent = (
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
      {enabledContent}
      {disabledContent}
      <Row>
        <Col lg={12}>
          <AppButton
            style={{ marginTop: 30 }}
            type="submit"
            label={buttonLabel}
            disabled={pristine || submitting}
            primary
          />
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
