import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { reduxForm, Field } from 'redux-form';
import { Row, Col } from 'react-flexbox-grid/lib';
import composeIntlForm from '../../common/IntlForm';
import AppButton from '../../common/AppButton';
import { emptyString } from '../../../lib/formValidators';
import messages from '../../../resources/messages';

const localMessages = {
  mainTitle: { id: 'source.maintitle', defaultMessage: 'Create New Source' },
  addButton: { id: 'source.add.saveAll', defaultMessage: 'Save New Source' },
  feedback: { id: 'source.add.feedback', defaultMessage: 'We saved your new source' },
};

const StoryDetailForm = (props) => {
  const { initialValues, buttonLabel, pristine, submitting, handleSubmit, onSave, renderTextField } = props;
  // need to init initialValues a bit on the way in to make lower-level logic work right
  const cleanedInitialValues = initialValues ? { ...initialValues } : {};
  if (cleanedInitialValues.disabled === undefined) {
    cleanedInitialValues.disabled = false;
  }
  return (
    <form className="app-form source-form" name="storyDetailForm" onSubmit={handleSubmit(onSave.bind(this))}>
      <Row>
        <Col lg={12}>
          <h2><FormattedMessage {...localMessages.basics} /></h2>
        </Col>
      </Row>
      <Row>
        <Col lg={6}>
          <Field
            name="title"
            component={renderTextField}
            floatingLabelText={messages.title}
            fullWidth
          />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <Field
            name="description"
            component={renderTextField}
            fullWidth
            floatingLabelText={messages.description}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={6}>
          <Field
            name="url"
            component={renderTextField}
            type="inline"
            fullWidth
            floatingLabelText={messages.url}
            label={messages.url}
            hintText={messages.url}
          />
        </Col>
      </Row>
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

StoryDetailForm.propTypes = {
  // from parent
  onSave: PropTypes.func.isRequired,
  buttonLabel: PropTypes.string.isRequired,
  initialValues: PropTypes.object,
  // from context
  intl: PropTypes.object.isRequired,
  renderTextField: PropTypes.func.isRequired,
  renderSelectField: PropTypes.func.isRequired,
  collections: PropTypes.array,
  // from form healper
  handleSubmit: PropTypes.func,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
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
  form: 'storyDetailForm',
  validate,
};

export default
  injectIntl(
    composeIntlForm(
      reduxForm(reduxFormConfig)(
        StoryDetailForm
      ),
    ),
  );
