import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Row, Col } from 'react-flexbox-grid/lib';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import MenuItem from 'material-ui/MenuItem';
import { emptyString } from '../../../lib/formValidators';
import composeIntlForm from '../../common/IntlForm';

const localMessages = {
  name: { id: 'topic.form.detail.name', defaultMessage: 'Name' },
  nameError: { id: 'topic.form.detail.name.error', defaultMessage: 'Your topic needs a name.' },
  advancedSettings: { id: 'topic.form.detail.advancedSettings', defaultMessage: 'Advanced Settings' },
  description: { id: 'topic.form.detail.description', defaultMessage: 'Description' },
  descriptionError: { id: 'topic.form.detail.desciption.error', defaultMessage: 'Your topic need a descriptino.' },
  seedQuery: { id: 'topic.form.detail.seedQuery', defaultMessage: 'Seed Query' },
  seedQueryError: { id: 'topic.form.detail.seedQuery.error', defaultMessage: 'You must give us a seed query to start this topic from.' },
  start_date: { id: 'topic.form.detail.start_date', defaultMessage: 'Start Date' },
  end_date: { id: 'topic.form.detail.end_date', defaultMessage: 'End Date' },
  public: { id: 'topic.form.detail.public', defaultMessage: 'Public?' },
  monitored: { id: 'topic.form.detail.monitored', defaultMessage: 'Crimson Hexagon Id' },
  spidered: { id: 'topic.form.detail.spidered', defaultMessage: 'Spidered ?' },
  max_iterations: { id: 'topic.form.detail.max_iterations', defaultMessage: 'Max Iterations' },
  twitter_topics_id: { id: 'topic.form.detail.twitter_topic', defaultMessage: 'Twitter Id' },
  createTopic: { id: 'topic.form.detail.create', defaultMessage: 'Create' },
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
            floatingLabelText={formatMessage(localMessages.start_date)}
            label={formatMessage(localMessages.start_date)}
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
            floatingLabelText={formatMessage(localMessages.end_date)}
            label={formatMessage(localMessages.end_date)}
            hintText={formatMessage(localMessages.end_date)}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={2}>
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
            multiLine
            rows={2}
            rowsMax={4}
            fullWidth
            floatingLabelText={localMessages.seedQuery}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={8}>
          <Card style={{ boxShadow: 'none' }} >
            <CardHeader
              style={{ fontWeight: 'bold' }}
              title={formatMessage(localMessages.advancedSettings)}
              actAsExpander
              showExpandableButton
            />
            <CardText expandable>
              <Row>
                <Col lg={12}>
                  <Field
                    name="ch_monitor_id"
                    component={renderTextField}
                    fullWidth
                    floatingLabelText={formatMessage(localMessages.monitored)}
                  />
                </Col>
              </Row>
              <Row>
                <Col lg={12}>
                  <Field
                    name="twitter_topics_id"
                    component={renderTextField}
                    fullWidth
                    floatingLabelText={formatMessage(localMessages.twitter_topics_id)}
                  />
                </Col>
              </Row>
              <Row>
                <Col lg={12}>
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
                <Col lg={12}>
                  <Field
                    name="spidered"
                    component={renderCheckbox}
                    fullWidth
                    label={localMessages.spidered}
                  />
                </Col>
              </Row>
            </CardText>
          </Card>
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
