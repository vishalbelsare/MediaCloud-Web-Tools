import React from 'react';
import { injectIntl } from 'react-intl';
import { reduxForm, Field } from 'redux-form';
import { Row, Col } from 'react-flexbox-grid/lib';
import composeIntlForm from '../../common/IntlForm';
import AppButton from '../../common/AppButton';
// import SourceDetailsForm from './SourceDetailsForm';
import { emptyString } from '../../../lib/formValidators';

const localMessages = {
  mainTitle: { id: 'explorer.queryBuilder.maintitle', defaultMessage: 'Create Query' },
  addButton: { id: 'explorer.queryBuilder.saveAll', defaultMessage: 'Search' },
  feedback: { id: 'explorer.queryBuilder.feedback', defaultMessage: 'We saved your new source' },
};

const renderQueryForm = (props) => {
  const { currentQuery, renderTextField } = props;
  return (
    <div>
      <h4>Query</h4>
      <Field
        name={`${currentQuery.query}`}
        type="text"
        component={renderTextField}
        label="First Name"
      />
      <Field
        name={`${currentQuery.color}`}
        type="text"
        component={renderTextField}
        label="Color"
      />
    </div>
  );
};

renderQueryForm.propTypes = {
  renderTextField: React.PropTypes.func.isRequired,
  currentQuery: React.PropTypes.object.isRequired,
};

const QueryForm = (props) => {
  const { initialValues, buttonLabel, pristine, submitting, handleSubmit, onSave } = props;
  // need to init initialValues a bit on the way in to make lower-level logic work right
  const cleanedInitialValues = initialValues ? { ...initialValues } : {};
  if (cleanedInitialValues.disabled === undefined) {
    cleanedInitialValues.disabled = false;
  }


  return (
    <form className="app-form query-form" name="queryForm" onSubmit={handleSubmit(onSave.bind(this))}>
      <h3>{`${initialValues.label}`}</h3>
      {renderQueryForm}
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
