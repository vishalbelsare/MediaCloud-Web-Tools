import React from 'react';
import { injectIntl } from 'react-intl';
import { reduxForm } from 'redux-form';
import { Row, Col } from 'react-flexbox-grid/lib';
import composeIntlForm from '../../../common/IntlForm';
import AppButton from '../../../common/AppButton';
import SourceDetailsForm from './SourceDetailsForm';
import SourceMetadataForm from './SourceMetadataForm';
import SourceCollectionsForm from './SourceCollectionsForm';
import { emptyString } from '../../../../lib/formValidators';

const localMessages = {
  mainTitle: { id: 'source.maintitle', defaultMessage: 'Create New Source' },
  addButton: { id: 'source.add.saveAll', defaultMessage: 'Save New Source' },
  feedback: { id: 'source.add.feedback', defaultMessage: 'We saved your new source' },
};

const CreateSourceForm = (props) => {
  const { initialValues, buttonLabel, pristine, submitting, handleSubmit, onSave } = props;
  return (
    <div className="sourceForm">
      <form className="source-form" name="sourceForm" onSubmit={handleSubmit(onSave.bind(this))}>
        <SourceDetailsForm initialValues={initialValues} />
        <SourceMetadataForm initialValues={initialValues} />
        <SourceCollectionsForm initialValues={initialValues} />
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
    </div>
  );
};

CreateSourceForm.propTypes = {
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
  form: 'sourceCreateForm',
  validate,
};

export default
  injectIntl(
    composeIntlForm(
      reduxForm(reduxFormConfig)(
        CreateSourceForm
      ),
    ),
  );
