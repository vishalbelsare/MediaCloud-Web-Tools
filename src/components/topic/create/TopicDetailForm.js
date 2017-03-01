import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Row, Col } from 'react-flexbox-grid/lib';
import MenuItem from 'material-ui/MenuItem';
import { emptyString } from '../../../lib/formValidators';
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
  public: { id: 'topic.public', defaultMessage: 'Public ?' },
  sources: { id: 'topic.sources', defaultMessage: 'Sources' },
  collections: { id: 'topic.collections', defaultMessage: 'Collections' },
  monitored: { id: 'topic.monitored', defaultMessage: 'Crimson Hexagon Id' },
  spidered: { id: 'topic.spidered', defaultMessage: 'Spidered ?' },
  max_iterations: { id: 'topic.max_iterations', defaultMessage: 'Max Iterations' },
  twitter_topics_id: { id: 'topic.twitter_topic', defaultMessage: 'Twitter Id' },
  createTopic: { id: 'topic.create', defaultMessage: 'Create' },
};

const TopicDetailForm = (props) => {
  const { initialValues, renderTextField, renderCheckbox, renderSelectField, renderDatePickerInline } = props;
  const { formatMessage } = props.intl;
  const iterations = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  return (
    <div>
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
            value={initialValues}
            name="start_date"
            component={renderDatePickerInline}
            type="inline"
            fullWidth
            hintText={formatMessage(localMessages.start_date)}
          />
        </Col>
        <Col lg={5}>
          <Field
            value={initialValues}
            name="end_date"
            component={renderDatePickerInline}
            type="inline"
            fullWidth
            hintText={formatMessage(localMessages.end_date)}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={10}>
          <Field
            name="is_public"
            component={renderCheckbox}
            fullWidth
            label={formatMessage(localMessages.public)}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={10}>
          <Field
            name="solr_seed_query"
            component={renderTextField}
            fullWidth
            floatingLabelText={localMessages.seedQuery}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <h2>AdvancedSettings</h2>
        </Col>
      </Row>
      <Row>
        <Col lg={2}>
          <Field
            name="ch_monitor_id"
            component={renderTextField}
            fullWidth
            floatingLabelText={formatMessage(localMessages.monitored)}
          />
        </Col>
        <Col lg={2}>
          <Field
            name="twitter_topics_id"
            component={renderTextField}
            fullWidth
            floatingLabelText={formatMessage(localMessages.twitter_topics_id)}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={2}>
          <Field
            name="max_iterations"
            component={renderSelectField}
            fullWidth
            floatingLabelText={localMessages.max_iterations}
          >
            {iterations.map(t => <MenuItem key={t} value={t} primaryText={t} />)}
          </Field>
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
    </div>
  );
};

TopicDetailForm.propTypes = {
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
  renderTextField: React.PropTypes.func.isRequired,
  renderCheckbox: React.PropTypes.func.isRequired,
  renderSelectField: React.PropTypes.func.isRequired,
  renderDatePickerInline: React.PropTypes.func.isRequired,
  initialValues: React.PropTypes.object,
  // from form helper
  handleSubmit: React.PropTypes.func.isRequired,
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
      TopicDetailForm
    )
  );
