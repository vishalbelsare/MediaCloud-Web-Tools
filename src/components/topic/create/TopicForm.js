import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Row, Col } from 'react-flexbox-grid/lib';
import { emptyString } from '../../../lib/formValidators';
import AppButton from '../../common/AppButton';
import composeIntlForm from '../../common/IntlForm';

const localMessages = {
  name: { id: 'topic.name', defaultMessage: 'Name' },
  nameError: { id: 'topic.name.error', defaultMessage: 'Your topic needs a name.' },
  description: { id: 'topic.description', defaultMessage: 'Description' },
  descriptionError: { id: 'topic.desciption.error', defaultMessage: 'Your topic need a descriptino.' },
  seedQuery: { id: 'topic.seedQuery', defaultMessage: 'Seed Query' },
  seedQueryError: { id: 'topic.seedQuery.error', defaultMessage: 'You must give us a seed query to start this topic from.' },
  spidered: { id: 'topic.spidered', defaultMessage: 'Spidered?' },
  suggest: { id: 'topic.suggest', defaultMessage: 'Suggest' },
};

const TopicForm = (props) => {
  const { onSaveTopic, handleSubmit, pristine, submitting, renderTextField, renderCheckbox } = props;
  const { formatMessage } = props.intl;
  return (
    <form className="create-topic" name="createTopicForm" onSubmit={handleSubmit(onSaveTopic.bind(this))}>
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
            name="seedQuery"
            component={renderTextField}
            fullWidth
            floatingLabelText={localMessages.seedQuery}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={10}>
          <Field
            name="spidered"
            component={renderCheckbox}
            fullWidth
            label={localMessages.spidered}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={2} xs={12}>
          <AppButton
            style={{ marginTop: 30 }}
            type="submit"
            disabled={pristine || submitting}
            label={formatMessage(localMessages.suggest)}
            primary
          />
        </Col>
      </Row>
    </form>
  );
};

TopicForm.propTypes = {
  // from parent
  onSaveTopic: React.PropTypes.func.isRequired,
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
  renderTextField: React.PropTypes.func.isRequired,
  renderCheckbox: React.PropTypes.func.isRequired,
  initialValues: React.PropTypes.object,
  // from form helper
  handleSubmit: React.PropTypes.func.isRequired,
  pristine: React.PropTypes.bool.isRequired,
  submitting: React.PropTypes.bool.isRequired,
};

function validate(values) {
  const errors = {};
  if (emptyString(values.name)) {
    errors.name = localMessages.nameError;
  }
  if (emptyString(values.description)) {
    errors.description = localMessages.descriptionError;
  }
  if (emptyString(values.seedQuery)) {
    errors.seedQuery = localMessages.seedQueryError;
  }
  if (emptyString(values.reason)) {
    errors.reason = localMessages.reasonError;
  }
  return errors;
}

const reduxFormConfig = {
  form: 'createTopic',
  validate,
};

export default
  composeIntlForm(
    reduxForm(reduxFormConfig)(
      TopicForm
    )
  );
