import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import { notEmptyString } from '../../../../lib/formValidators';
import composeIntlForm from '../../../common/IntlForm';

const localMessages = {
  nameLabel: { id: 'source.add.name.label', defaultMessage: 'Name of Source' },
  urlLabel: { id: 'source.add.url.label', defaultMessage: 'URL' },
  notesLabel: { id: 'source.add.notes.label', defaultMessage: 'Editor`s Notes' },
  nameError: { id: 'source.add.name.error', defaultMessage: 'You have to enter a name for this source.' },
  urlError: { id: 'source.add.url.error', defaultMessage: 'Pick have to enter a url for this source.' },
};

const SourceDetailsForm = (props) => {
  const { handleSubmit, onSave, renderTextField } = props;
  return (
    <form className="source-details-form" name="sourcesSourceDetailsForm" onSubmit={handleSubmit(onSave.bind(this))}>
      <Row>
        <Col lg={12}>
          <Field
            name="name"
            component={renderTextField}
            floatingLabelText={localMessages.nameLabel}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <Field
            name="url"
            component={renderTextField}
            floatingLabelText={localMessages.urlLabel}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <Field
            name="notes"
            component={renderTextField}
            fullWidth
            floatingLabelText={localMessages.notesLabel}
          />
        </Col>
      </Row>
    </form>
  );
};

SourceDetailsForm.propTypes = {
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
  renderTextField: React.PropTypes.func.isRequired,
  // from form helper
  handleSubmit: React.PropTypes.func,
  fields: React.PropTypes.array.isRequired,
  pristine: React.PropTypes.bool.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  // from parent
  onSave: React.PropTypes.func.isRequired,
  initialValues: React.PropTypes.object,
};

function validate(values) {
  const errors = {};
  if (!notEmptyString(values.name)) {
    errors.email = localMessages.nameError;
  }
  if (!notEmptyString(values.url)) {
    errors.permission = localMessages.urlError;
  }
  return errors;
}

const reduxFormConfig = {
  form: 'sourceDetailsForm',
  fields: ['name', 'url', 'notes'],
  validate,
};

export default
  injectIntl(
    composeIntlForm(
      reduxForm(reduxFormConfig)(
        SourceDetailsForm
      )
    )
  );
