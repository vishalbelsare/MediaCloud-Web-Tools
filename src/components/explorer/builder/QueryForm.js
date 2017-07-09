import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { reduxForm, Field, propTypes } from 'redux-form';
import { Row, Col } from 'react-flexbox-grid/lib';
import Link from 'react-router/lib/Link';
import DataCard from '../../common/DataCard';
import composeIntlForm from '../../common/IntlForm';
import AppButton from '../../common/AppButton';
import ColorPicker from '../../common/ColorPicker';
import SourceCollectionsForm from './SourceCollectionsForm';
// import { emptyString } from '../../../lib/formValidators';

const localMessages = {
  mainTitle: { id: 'explorer.queryBuilder.maintitle', defaultMessage: 'Create Query' },
  addButton: { id: 'explorer.queryBuilder.saveAll', defaultMessage: 'Search' },
  feedback: { id: 'explorer.queryBuilder.feedback', defaultMessage: 'We saved your new source' },
  query: { id: 'explorer.queryBuilder.query', defaultMessage: 'Enter a query' },
  selectSandC: { id: 'explorer.queryBuilder.sAndC', defaultMessage: 'Select media' },
  color: { id: 'explorer.queryBuilder.color', defaultMessage: 'Choose a color' },
  dates: { id: 'explorer.queryBuilder.dates', defaultMessage: 'For dates' },
  learnHowTo: { id: 'explorer.queryBuilder.learnHowTo', defaultMessage: 'Learn how to build query strings' },
  dateTo: { id: 'explorer.queryBuilder.dateTo', defaultMessage: 'to' },
};

const QueryForm = (props) => {
  const { initialValues, selected, isEditable, buttonLabel, submitting, handleSubmit, onSave, onChange, renderTextField } = props;
  // need to init initialValues a bit on the way in to make lower-level logic work right
  const cleanedInitialValues = initialValues ? { ...initialValues } : {};
  if (cleanedInitialValues.disabled === undefined) {
    cleanedInitialValues.disabled = false;
  }

  if (selected === null) return 'Error';

  const currentColor = selected.color; // for ColorPicker
  const currentQ = selected.q;
// we may have a query or a query object for initialValues
  return (
    <form className="app-form query-form" name="queryForm" onSubmit={handleSubmit(onSave.bind(this))} onChange={onChange}>
      <DataCard>
        <Row>
          <Col lg={6}>
            <Row>
              <FormattedMessage {...localMessages.query} />
            </Row>
            <Row>
              <Field
                className="query-field"
                name="q"
                type="text"
                value={currentQ}
                underlineShow={false}
                multiLine
                rows={3}
                rowsMax={4}
                component={renderTextField}
              />
            </Row>
            <Row>
              <Col lg={6}>&nbsp;</Col>
            </Row>
            <Row>
              <Link to={'/howToBuildQueries'}><FormattedMessage {...localMessages.learnHowTo} /></Link>
            </Row>
          </Col>
          <Col lg={6}>
            <Row>
              <FormattedMessage {...localMessages.selectSandC} />
            </Row>
            <Row>
              <Col lg={6}>&nbsp;</Col>
            </Row>
            <Row>
              <SourceCollectionsForm
                className="query-field"
                form="queryForm"
                destroyOnUnmount={false}
                enableReinitialize
                initialValues={cleanedInitialValues}
                selected={selected}
                allowRemoval={isEditable}
              />
            </Row>
            <Row>
              <Col lg={6}>&nbsp;</Col>
            </Row>
            <Row>
              <FormattedMessage {...localMessages.dates} />
            </Row>
            <Row>
              <Col lg={2} sm={1}>
                <Field
                  className="query-field"
                  maxLength="12"
                  name="startDate"
                  type="inline"
                  component={renderTextField}
                  underlineShow={false}
                />
              </Col>
              <FormattedMessage {...localMessages.dateTo} />
              <Col lg={1}>
                <Field
                  className="query-field"
                  maxLength="12"
                  name="endDate"
                  type="inline"
                  component={renderTextField}
                  underlineShow={false}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col lg={3}>
            <FormattedMessage {...localMessages.color} />
            <ColorPicker
              name="color"
              color={currentColor}
              onChange={onChange}
            />
          </Col>
        </Row>
      </DataCard>
      <Col lg={11} />
      <Col lg={1}>
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
  isEditable: React.PropTypes.bool.isRequired,
};

/* function validate(values) {
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
} */

export default
  injectIntl(
    composeIntlForm(
      reduxForm({ propTypes })(
        QueryForm
      ),
    ),
  );
