import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { reduxForm, Field, propTypes } from 'redux-form';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import composeIntlForm from '../../common/IntlForm';
import AppButton from '../../common/AppButton';
import ColorPicker from '../../common/ColorPicker';
import composeHelpfulContainer from '../../common/HelpfulContainer';
import SourceCollectionsForm from './SourceCollectionsForm';
// import { emptyString } from '../../../lib/formValidators';
import SelectMediaDialog from '../../common/mediaPicker/SelectMediaDialog';

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
  queryHelpTitle: { id: 'explorer.queryBuilder.queryHelp.title', defaultMessage: 'Building Query Strings' },
  queryHelpContent: { id: 'explorer.queryBuilder.queryHelp.content', defaultMessage: '<p>You can write boolean queries to search against out database. To search for a single word, just enter that word:</p><code>gender</code><p>You can also use boolean and phrase searches like this:</p><code>"gender equality" OR "gender equity"</code>' },
};

const QueryForm = (props) => {
  const { initialValues, selected, buttonLabel, handleOpenHelp, submitting, handleSubmit, onSave, onChange, renderTextField } = props;
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
      <div className="query-form-wrapper">
        <Grid>
          <Row>
            <Col lg={5}>
              <div className="q-field-wrapper">
                <label htmlFor="q"><FormattedMessage {...localMessages.query} /></label>
                <Field
                  className="query-field"
                  name="q"
                  type="text"
                  value={currentQ}
                  underlineShow={false}
                  multiLine
                  rows={3}
                  rowsMax={4}
                  fullWidth
                  component={renderTextField}
                />
                <a href="#query-help" onClick={handleOpenHelp}><FormattedMessage {...localMessages.learnHowTo} /></a>
              </div>
              <div className="color-field-wrapper">
                <label className="inline" htmlFor="color"><FormattedMessage {...localMessages.color} /></label>
                <ColorPicker
                  name="color"
                  color={currentColor}
                  onChange={onChange}
                />
              </div>
            </Col>
            <Col lg={1} />
            <Col lg={6}>
              <SelectMediaDialog onConfirmSelection={selections => onChange(selections)} />
              <div className="media-field-wrapper">
                <label htmlFor="sources"><FormattedMessage {...localMessages.selectSandC} /></label>
                <SourceCollectionsForm
                  className="query-field"
                  form="queryForm"
                  destroyOnUnmount={false}
                  enableReinitialize
                  initialValues={cleanedInitialValues}
                  selected={cleanedInitialValues}
                  allowRemoval={false}
                />
              </div>
              <div className="dates-field-wrapper">
                <label htmlFor="startDate"><FormattedMessage {...localMessages.dates} /></label>
                <Field
                  className="query-field start-date-wrapper"
                  maxLength="12"
                  name="startDate"
                  type="inline"
                  component={renderTextField}
                  underlineShow={false}
                />
                <div className="date-for-wrapper"><FormattedMessage {...localMessages.dateTo} /></div>
                <Field
                  className="query-field end-date-wrapper"
                  maxLength="12"
                  name="endDate"
                  type="inline"
                  component={renderTextField}
                  underlineShow={false}
                />
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
      <Grid>
        <Row>
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
        </Row>
      </Grid>
    </form>
  );
};

QueryForm.propTypes = {
  // from parent
  selected: React.PropTypes.array.isRequired,
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
  handleOpenHelp: React.PropTypes.func.isRequired,
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
      composeHelpfulContainer(localMessages.queryHelpTitle, localMessages.queryHelpContent)(
        reduxForm({ propTypes })(
          QueryForm
        ),
      ),
    ),
  );
