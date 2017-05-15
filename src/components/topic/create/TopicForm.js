import React from 'react';
import { reduxForm } from 'redux-form';
import { Row, Col } from 'react-flexbox-grid/lib';
import AppButton from '../../common/AppButton';
import composeIntlForm from '../../common/IntlForm';
import TopicDetailForm from './TopicDetailForm';
import SourceCollectionsForm from '../../common/form/SourceCollectionsForm';
import { emptyString, invalidDate } from '../../../lib/formValidators';
import { isMoreThanAYearInPast } from '../../../lib/dateUtil';

export const TOPIC_FORM_MODE_EDIT = 'TOPIC_FORM_MODE_EDIT';
export const TOPIC_FORM_MODE_CREATE = 'TOPIC_FORM_MODE_CREATE';

const localMessages = {
  name: { id: 'topic.name', defaultMessage: 'Name' },
  nameError: { id: 'topic.form.detail.name.error', defaultMessage: 'Your topic needs a name.' },
  descriptionError: { id: 'topic.form.detail.desciption.error', defaultMessage: 'Your topic need a description.' },
  seedQueryError: { id: 'topic.form.detail.seedQuery.error', defaultMessage: 'You must give us a seed query to start this topic from.' },
  createTopic: { id: 'topic.form.detail.create', defaultMessage: 'Create' },
  dateError: { id: 'topic.form.detail.date.error', defaultMessage: 'Please provide a date in YYYY-MM-DD format.' },
  startDateWarning: { id: 'topic.form.detail.startdate.warning', defaultMessage: "For older dates we find that spidering doesn't work that well due to link-rot (urls that don't work anymore). We advise not going back more than 18 months." },
  sourceCollectionsError: { id: 'topic.form.detail.sourcesCollections.error', defaultMessage: 'You must select at least one Source or one Collection to seed this topic.' },
};

const TopicForm = (props) => {
  const { onSaveTopic, handleSubmit, pristine, submitting, initialValues, title, intro, mode } = props;
  return (
    <form className="create-topic" name="topicForm" onSubmit={handleSubmit(onSaveTopic.bind(this))}>
      <TopicDetailForm
        form="topicForm"
        destroyOnUnmount={false}
        initialValues={initialValues}
        mode={mode}
      />
      <SourceCollectionsForm
        title={title}
        intro={intro}
        form="topicForm"
        destroyOnUnmount={false}
        initialValues={initialValues}
        allowRemoval={mode === TOPIC_FORM_MODE_CREATE}
        maxSources={10}
        maxCollections={10}
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
  validate: React.PropTypes.func.isRequired,
  mode: React.PropTypes.string.isRequired,  // one of the TOPIC_FORM_MODE_ constants - needed to show warnings while editing
};

function validate(values, props) {
  const errors = {};
  const { formatMessage } = props.intl;
  if (emptyString(values.name)) {
    errors.name = localMessages.nameError;
  }
  if (emptyString(values.description)) {
    errors.description = localMessages.descriptionError;
  }
  if (emptyString(values.solr_seed_query)) {
    errors.solr_seed_query = localMessages.seedQueryError;
  }
  if (invalidDate(values.start_date)) {
    errors.start_date = localMessages.dateError;
  }
  if (invalidDate(values.end_date)) {
    errors.end_date = localMessages.dateError;
  }
  // not triggered if empty so we have to force a check
  if ((values.name && values.solr_seed_query && !values.sourcesAndCollections) || (values.sourcesAndCollections && values.sourcesAndCollections.length < 1)) {
    // errors.sourcesAndCollections = localMessages.sourceCollectionsError;
    const msg = formatMessage(localMessages.sourceCollectionsError);
    errors.sourcesAndCollections = { _error: msg };
  }
  return errors;
}

const warn = (values) => {
  let warnings = {};
  // const { formatMessage } = props.intl;
  if (!invalidDate(values.start_date) && isMoreThanAYearInPast(values.start_date)) {
    warnings = { start_date: localMessages.startDateWarning };
  }
  return warnings;
};

const reduxFormConfig = {
  form: 'topicForm',
  validate,
  destroyOnUnmount: false,
  warn,
};

export default
  composeIntlForm(
    reduxForm(reduxFormConfig)(
      TopicForm
    )
  );
