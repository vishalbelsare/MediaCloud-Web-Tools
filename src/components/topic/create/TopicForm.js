import React from 'react';
import { reduxForm } from 'redux-form';
import { Row, Col } from 'react-flexbox-grid/lib';
import { emptyString } from '../../../lib/formValidators';
import AppButton from '../../common/AppButton';
import composeIntlForm from '../../common/IntlForm';
import TopicDetailForm from './TopicDetailForm';
import SourceCollectionsForm from '../../common/form/SourceCollectionsForm';

export const TOPIC_FORM_MODE_EDIT = 'TOPIC_FORM_MODE_EDIT';
export const TOPIC_FORM_MODE_CREATE = 'TOPIC_FORM_MODE_CREATE';

const localMessages = {
  name: { id: 'topic.name', defaultMessage: 'Name' },
};

const TopicForm = (props) => {
  const { onSaveTopic, handleSubmit, pristine, submitting, initialValues, title, intro, mode } = props;
  return (
    <form className="create-topic" name="topicForm" onSubmit={handleSubmit(onSaveTopic.bind(this))}>
      <TopicDetailForm initialValues={initialValues} mode={mode} />
      <SourceCollectionsForm
        title={title}
        intro={intro}
        form="topicForm"
        initialValues={initialValues}
        allowRemoval={mode === TOPIC_FORM_MODE_CREATE}
      />
      <Row>
        <Col lg={12}>
          <AppButton
            style={{ marginTop: 30 }}
            type="submit"
            disabled={pristine || submitting}
            label={initialValues.buttonLabel}
            primary
          />
        </Col>
      </Row>

    </form>
  );
};

TopicForm.propTypes = {
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
  initialValues: React.PropTypes.object,
  // from parent
  handleSubmit: React.PropTypes.func.isRequired,
  onSaveTopic: React.PropTypes.func.isRequired,
  pristine: React.PropTypes.bool.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  title: React.PropTypes.string.isRequired,
  intro: React.PropTypes.string.isRequired,
  mode: React.PropTypes.string.isRequired,  // one of the TOPIC_FORM_MODE_ constants - needed to show warnings while editing
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
  form: 'topicForm',
  validate,
};

export default
  composeIntlForm(
    reduxForm(reduxFormConfig)(
      TopicForm
    )
  );
