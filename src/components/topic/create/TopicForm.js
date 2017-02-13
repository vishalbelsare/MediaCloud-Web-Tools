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
  start_date: { id: 'topic.start_date', defaultMessage: 'Start Date' },
  end_date: { id: 'topic.end_date', defaultMessage: 'End Date' },
  public: { id: 'topic.public', defaultMessage: 'Public?' },
  sources: { id: 'topic.sources', defaultMessage: 'Sources' },
  collections: { id: 'topic.collections', defaultMessage: 'Collections' },
  monitored: { id: 'topic.monitored', defaultMessage: 'Monitored?' },
  spidered: { id: 'topic.spidered', defaultMessage: 'Spidered?' },
  max_iterations: { id: 'topic.max_iterations', defaultMessage: 'Max Iterations' },
  twitter_topic: { id: 'topic.twitter_topic', defaultMessage: 'Twitter' },
  createTopic: { id: 'topic.create', defaultMessage: 'Create' },
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
        <Col lg={5}>
          <Field
            name="start_date"
            component={renderTextField}
            fullWidth
            floatingLabelText={localMessages.start_date}
          />
        </Col>
        <Col lg={5}>
          <Field
            name="end_date"
            component={renderTextField}
            fullWidth
            floatingLabelText={localMessages.end_date}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={10}>
          <Field
            name="is_public"
            component={renderCheckbox}
            fullWidth
            floatingLabelText={localMessages.public}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={10}>
          <Field
            name="is_monitored"
            component={renderCheckbox}
            fullWidth
            floatingLabelText={localMessages.monitored}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={10}>
          <Field
            name="max_iterations"
            component={renderTextField}
            fullWidth
            floatingLabelText={localMessages.max_iterations}
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
            label={formatMessage(localMessages.createTopic)}
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
