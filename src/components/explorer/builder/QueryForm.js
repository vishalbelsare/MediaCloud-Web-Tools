import React from 'react';
import { injectIntl } from 'react-intl';
import { reduxForm, Field } from 'redux-form';
import { Row, Col } from 'react-flexbox-grid/lib';
import DataCard from '../../common/DataCard';
import composeIntlForm from '../../common/IntlForm';
import AppButton from '../../common/AppButton';
import ColorPicker from '../../common/ColorPicker';
import messages from '../../../resources/messages';
import SourceCollectionsForm from './SourceCollectionsForm';
import { emptyString } from '../../../lib/formValidators';

const localMessages = {
  mainTitle: { id: 'explorer.queryBuilder.maintitle', defaultMessage: 'Create Query' },
  addButton: { id: 'explorer.queryBuilder.saveAll', defaultMessage: 'Search' },
  feedback: { id: 'explorer.queryBuilder.feedback', defaultMessage: 'We saved your new source' },
  query: { id: 'explorer.queryBuilder.query', defaultMessage: 'Enter a query' },
  selectSandC: { id: 'explorer.queryBuilder.sAndC', defaultMessage: 'Select media' },
  color: { id: 'explorer.queryBuilder.color', defaultMessage: 'Choose a color' },
  dates: { id: 'explorer.queryBuilder.dates', defaultMessage: 'For dates' },
};

const QueryForm = (props) => {
  const { initialValues, selected, buttonLabel, submitting, handleSubmit, onSave, onChange, renderTextField } = props;
  const { formatMessage } = props.intl;
  // need to init initialValues a bit on the way in to make lower-level logic work right
  const cleanedInitialValues = initialValues ? { ...initialValues } : {};
  if (cleanedInitialValues.disabled === undefined) {
    cleanedInitialValues.disabled = false;
  }
  const currentColor = selected.color; // for ColorPicker

// we may have a query or a query object for initialValues
  return (
    <form className="app-form query-form" name="queryForm" onSubmit={handleSubmit(onSave.bind(this))} onChange={onChange}>
      <DataCard>
        <Row>
          <Col lg={6}>
            <Field
              name="q"
              type="text"
              multiLine
              rows={3}
              rowsMax={4}
              component={renderTextField}
              label={formatMessage(localMessages.query)}
              floatingLabelText={formatMessage(localMessages.query)}
            />
          </Col>
          <Col lg={6}>
            <SourceCollectionsForm
              form="queryForm"
              destroyOnUnmount={false}
              initialValues={cleanedInitialValues}
              allowRemoval
            />
            <Row>
              <Col lg={3}>
                <Field
                  name="startDate"
                  type="inline"
                  component={renderTextField}
                  label={formatMessage(messages.startDate)}
                  floatingLabelText={formatMessage(messages.startDate)}
                />
              </Col>
              <Col lg={3}>
                <Field
                  name="endDate"
                  type="inline"
                  component={renderTextField}
                  label={formatMessage(messages.endDate)}
                  floatingLabelText={formatMessage(messages.endDate)}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <ColorPicker
            name="color"
            color={currentColor}
            onChange={onChange}
          />
          <Field
            name="color"
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
          disabled={submitting}
          primary
        />
      </Col>
    </form>
  );
};

QueryForm.propTypes = {
  // from parent
  selected: React.PropTypes.object.isRequired,
  onSave: React.PropTypes.func.isRequired,
  onChange: React.PropTypes.func,
  buttonLabel: React.PropTypes.string.isRequired,
  initialValues: React.PropTypes.object,
  // from context
  intl: React.PropTypes.object.isRequired,
  renderTextField: React.PropTypes.func.isRequired,
  renderSelectField: React.PropTypes.func.isRequired,
  fields: React.PropTypes.object,
  meta: React.PropTypes.object,
  // from form healper
  updateQuery: React.PropTypes.func,
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
  if (!values.collections || !values.collections.length) {
    errors.collections = { _error: 'At least one collection must be chosen' };
  }
  return errors;
}

const reduxFormConfig = {
  form: 'queryForm',
  validate,
  enableReinitialize: true,
  destroyOnUnmount: true,
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
