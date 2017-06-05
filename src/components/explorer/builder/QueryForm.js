import React from 'react';
import { injectIntl } from 'react-intl';
import { reduxForm, Field } from 'redux-form';
import { Row, Col } from 'react-flexbox-grid/lib';
import DataCard from '../../common/DataCard';
import composeIntlForm from '../../common/IntlForm';
import AppButton from '../../common/AppButton';
// import SourceDetailsForm from './SourceDetailsForm';
import { emptyString } from '../../../lib/formValidators';

const localMessages = {
  mainTitle: { id: 'explorer.queryBuilder.maintitle', defaultMessage: 'Create Query' },
  addButton: { id: 'explorer.queryBuilder.saveAll', defaultMessage: 'Search' },
  feedback: { id: 'explorer.queryBuilder.feedback', defaultMessage: 'We saved your new source' },
};

const QueryForm = (props) => {
  const { initialValues, buttonLabel, pristine, submitting, handleSubmit, onSave, renderTextField, renderSelectField } = props;
  // need to init initialValues a bit on the way in to make lower-level logic work right
  const cleanedInitialValues = initialValues ? { ...initialValues } : {};
  if (cleanedInitialValues.disabled === undefined) {
    cleanedInitialValues.disabled = false;
  }

// we may have a query or a query object for initialValues
  return (
    <form className="app-form query-form" name="queryForm" onSubmit={handleSubmit(onSave.bind(this))}>
      <h3>{`${initialValues.label}`}</h3>
      <DataCard>
        <Row>
          <Col lg={6}>
            <Field
              name={`${initialValues.queryParams}`}
              value={`${initialValues.queryParams}`}
              type="text"
              multiLine
              component={renderTextField}
              label="Edit Query"
              floatingLabelText="edit query"
            />
          </Col>
          <Col lg={6}>
            <Field
              name={`${initialValues.color}`}
              type="text"
              component={renderSelectField}
              label="S and C"
              floatingLabelText="edit sources and collections"
            />
          </Col>
        </Row>
        <Row>
          <Field
            name={`${initialValues.color}`}
            type="text"
            component={renderTextField}
            label="Color"
            floatingLabelText="choose a color"
          />
        </Row>
      </DataCard>
      <Col lg={12}>
        <AppButton
          style={{ marginTop: 30 }}
          type="submit"
          label={buttonLabel}
          disabled={pristine || submitting}
          primary
        />
      </Col>
    </form>
  );
};

QueryForm.propTypes = {
  // from parent
  onSave: React.PropTypes.func.isRequired,
  buttonLabel: React.PropTypes.string.isRequired,
  initialValues: React.PropTypes.object,
  // from context
  intl: React.PropTypes.object.isRequired,
  renderTextField: React.PropTypes.func.isRequired,
  renderSelectField: React.PropTypes.func.isRequired,
  fields: React.PropTypes.object,
  meta: React.PropTypes.object,
  // from form healper
  handleSubmit: React.PropTypes.func,
  pristine: React.PropTypes.bool.isRequired,
  submitting: React.PropTypes.bool.isRequired,
};

function validate(values) {
  const errors = {};
  if (emptyString(values.query)) {
    errors.name = localMessages.queryError;
  }
  if (emptyString(values.color)) {
    errors.url = localMessages.colorError;
  }
  return errors;
}

const reduxFormConfig = {
  form: 'queryForm',
  validate,
  // may need to add the initialValues here...
};

export default
  injectIntl(
    composeIntlForm(
      reduxForm(reduxFormConfig)(
        QueryForm
      ),
    ),
  );
