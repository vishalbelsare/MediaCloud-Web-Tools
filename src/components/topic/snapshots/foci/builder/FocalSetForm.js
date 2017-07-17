import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { FormattedMessage, injectIntl } from 'react-intl';
import composeIntlForm from '../../../../common/IntlForm';
import { notEmptyString } from '../../../../../lib/formValidators';

const localMessages = {
  focalSetName: { id: 'focalSet.name', defaultMessage: 'Set Name' },
  focalSetDescription: { id: 'focalSet.description', defaultMessage: 'Set Description' },
  focalSetWhy: { id: 'focalSet.why', defaultMessage: 'Give your new Set a name and description so others can recognize what it is for.' },
  errorNoName: { id: 'focalSet.name.error', defaultMessage: 'You need to name this.' },
  errorNoDescription: { id: 'focalSet.description.error', defaultMessage: 'You need a description.' },
};

const FocalSetForm = (props) => {
  const { renderTextField, introContent, fullWidth } = props;
  const defaultIntroContent = (<p className="light"><i><FormattedMessage {...localMessages.focalSetWhy} /></i></p>);
  const fullWidthFields = fullWidth || false;
  const intro = introContent || defaultIntroContent;
  return (
    <div className="new-focal-set">
      {intro}
      <Field
        name="focalSetName"
        component={renderTextField}
        floatingLabelText={localMessages.focalSetName}
        fullWidth={fullWidthFields}
      />
      <br />
      <Field
        name="focalSetDescription"
        component={renderTextField}
        floatingLabelText={localMessages.focalSetDescription}
        fullWidth={fullWidthFields}
      />
    </div>
  );
};

FocalSetForm.propTypes = {
  // form compositinal chain
  intl: React.PropTypes.object.isRequired,
  renderTextField: React.PropTypes.func.isRequired,
  // from parent
  initialValues: React.PropTypes.object,
  introContent: React.PropTypes.object,
  fullWidth: React.PropTypes.bool,
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
  form: 'snapshotFocus', // make sure this matches the sub-components and other wizard steps
  destroyOnUnmount: false,  // so the wizard works
  validate,
};

export default
  composeIntlForm(
    reduxForm(reduxFormConfig)(
      injectIntl(
        FocalSetForm
      )
    )
  );
