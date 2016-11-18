import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import { notEmptyString } from '../../../lib/formValidators';
import AppButton from '../../common/AppButton';
import composeIntlForm from '../../common/IntlForm';
import messages from '../../../resources/messages';

const localMessages = {
  name: { id: 'topic.name', defaultMessage: 'Name' },
  description: { id: 'topic.description', defaultMessage: 'Description' },
  nameError: { id: 'topic.name.error', defaultMessage: 'Your topic needs a name.' },
  descriptionError: { id: 'topic.desciptino.error', defaultMessage: 'Your topic need a descriptino.' },
};

const TopicDetailsForm = (props) => {
  const { handleSubmit, onSave, pristine, submitting, renderTextField, renderCheckbox } = props;
  const { formatMessage } = props.intl;
  return (
    <form className="permission-form update-topic" name="topicForm" onSubmit={handleSubmit(onSave.bind(this))}>
      <Row>
        <Col lg={10}>
          <Field
            name="name"
            component={renderTextField}
            floatingLabelText={localMessages.name}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={10}>
          <Field
            name="description"
            component={renderTextField}
            fullWidth
            floatingLabelText={localMessages.description}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={10}>
          <Field
            name="public"
            component={renderCheckbox}
            fullWidth
            label={messages.topicPublicProp}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={2} xs={12}>
          <AppButton
            style={{ marginTop: 30 }}
            type="submit"
            disabled={pristine || submitting}
            label={formatMessage(messages.save)}
            primary
          />
        </Col>
      </Row>
    </form>
  );
};

TopicDetailsForm.propTypes = {
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
  renderTextField: React.PropTypes.func.isRequired,
  renderCheckbox: React.PropTypes.func.isRequired,
  initialValues: React.PropTypes.object,
  // from form helper
  handleSubmit: React.PropTypes.func,
  pristine: React.PropTypes.bool.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  // from parent
  onSave: React.PropTypes.func.isRequired,
};

function validate(values) {
  const errors = {};
  if (!notEmptyString(values.name)) {
    errors.name = localMessages.nameError;
  }
  if (!notEmptyString(values.description)) {
    errors.description = localMessages.descriptionError;
  }
  return errors;
}

const reduxFormConfig = {
  form: 'topicDetails',
  fields: ['name', 'description', 'public'],
  validate,
};

export default
  injectIntl(
    composeIntlForm(
      reduxForm(reduxFormConfig)(
        TopicDetailsForm
      )
    )
  );
