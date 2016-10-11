import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { FormattedMessage, injectIntl } from 'react-intl';
import composeIntlForm from '../../../../common/IntlForm';
import { notEmptyString } from '../../../../../lib/formValidators';

const localMessages = {
  focalSetName: { id: 'focalSet.name', defaultMessage: 'Focal Set Name' },
  focalSetDescription: { id: 'focalSet.description', defaultMessage: 'Focal Set Description' },
  focalSetWhy: { id: 'focalSet.why', defaultMessage: 'Give your new Focal Set a name and description so others can recognize what it is for.' },
  errorNoName: { id: 'focalSet.name.error', defaultMessage: 'You need to name this.' },
  errorNoDescription: { id: 'focalSet.description.error', defaultMessage: 'You need a description.' },
};

const CreateFocalSetForm = (props) => {
  const { renderTextField } = props;
  return (
    <div className="new-focal-set">
      <p className="light"><i><FormattedMessage {...localMessages.focalSetWhy} /></i></p>
      <Field
        name="focalSetName"
        component={renderTextField}
        floatingLabelText={localMessages.focalSetName}
      />
      <br />
      <Field
        name="focalSetDescription"
        component={renderTextField}
        floatingLabelText={localMessages.focalSetDescription}
      />
    </div>
  );
};

CreateFocalSetForm.propTypes = {
  intl: React.PropTypes.object.isRequired,
  renderTextField: React.PropTypes.func.isRequired,
};

function validate(values) {
  const errors = {};
  if (!notEmptyString(values.focalSetName)) {
    errors.focalSetName = localMessages.errorNoName;
  }
  if (!notEmptyString(values.focalSetDescription)) {
    errors.focalSetDescription = localMessages.errorNoDescription;
  }
  return errors;
}

const reduxFormConfig = {
  form: 'focusCreateSetup', // make sure this matches the sub-components and other wizard steps
  destroyOnUnmount: false,  // so the wizard works
  validate,
};

export default
  composeIntlForm(
    reduxForm(reduxFormConfig)(
      injectIntl(
        CreateFocalSetForm
      )
    )
  );
