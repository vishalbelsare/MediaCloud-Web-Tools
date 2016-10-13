import React from 'react';
import Title from 'react-title-component';
import { reduxForm } from 'redux-form';
import moment from 'moment';
import TextField from 'material-ui/TextField';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import Toggle from 'material-ui/Toggle';
import DatePicker from 'material-ui/DatePicker';
import AppButton from '../../common/AppButton';
import messages from '../../../resources/messages';
import { notEmptyString } from '../../../lib/formValidators';

const localMessages = {
  createTopicTitle: { id: 'topic.create.title', defaultMessage: 'Create a New Topic' },
  createTopicText: { id: 'topic.create.text', defaultMessage: 'You can suggest a new Topic to add to the MediaCloud system.' },
  createTopic: { id: 'topic.create', defaultMessage: 'Create Topic' },
};

const CreateTopicContainer = (props) => {
  const { fields: { name, description, startDate, endDate, skipSolrQuery, isPublic }, handleSubmit, onSubmitCreateTopicForm } = props;
  const { formatMessage } = props.intl;
  const defaultEndDate = new Date();
  const defaultStartDate = new Date();
  defaultStartDate.setMonth(defaultEndDate.getMonth() - 3);
  return (
    <Grid>
      <Title render={formatMessage(localMessages.createTopicTitle)} />
      <Row>
        <Col lg={6} md={6} sm={6}>
          <h1><FormattedMessage {...localMessages.createTopicTitle} /></h1>
          <p><FormattedMessage {...localMessages.createTopicText} /></p>
        </Col>
      </Row>

      <form onSubmit={handleSubmit(onSubmitCreateTopicForm.bind(this))}>
        <Row>
          <Col lg={3} md={4} sm={6}>
            <TextField
              floatingLabelText={formatMessage(messages.topicNameProp)}
              errorText={name.touched ? name.error : ''}
              {...name}
            />
            <br />
            <TextField
              floatingLabelText={formatMessage(messages.topicDescriptionProp)}
              multiLine
              rows={2}
              errorText={description.touched ? description.error : ''}
              {...description}
            />
          </Col>
          <Col lg={3} md={4} sm={6}>
            <DatePicker
              autoOk
              floatingLabelText={formatMessage(messages.topicStartDateProp)}
              container="inline"
              mode="landscape"
              errorText={startDate.touched ? startDate.error : ''}
              {...startDate}
            />
            <DatePicker
              autoOk
              floatingLabelText={formatMessage(messages.topicEndDateProp)}
              container="inline"
              mode="landscape"
              errorText={endDate.touched ? endDate.error : ''}
              {...endDate}
            />
          </Col>
          <Col lg={3} md={4} sm={6}>
            <Toggle
              label={formatMessage(messages.toicSkipSolrQueryProp)}
              {...skipSolrQuery}
            />
            <Toggle
              label={formatMessage(messages.topicPublicProp)}
              {...isPublic}
            />
          </Col>
        </Row>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <AppButton type="submit" label={formatMessage(localMessages.createTopic)} primary />
          </Col>
        </Row>
      </form>
    </Grid>
  );
};

CreateTopicContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  // from reduxForm
  fields: React.PropTypes.object.isRequired,
  handleSubmit: React.PropTypes.func.isRequired,
  // from dispatch
  onSubmitCreateTopicForm: React.PropTypes.func.isRequired,
};

function validate(values) {
  const errors = {};
  if (!notEmptyString(values.name)) {
    errors.name = 'You must enter a name';
  }
  if (!notEmptyString(values.description)) {
    errors.description = 'You must enter a description';
  }
  if (!notEmptyString(values.seedQuery)) {
    errors.seedQuery = 'You must enter a query';
  }
  if (!notEmptyString(values.startDate)) {
    errors.startDate = 'You must enter a start date';
  }
  if (!notEmptyString(values.endDate)) {
    errors.endDate = 'You must enter an end date';
  }
  if (notEmptyString(values.endDate) && notEmptyString(values.startDate)) {
    if (moment(values.startDate).unix() > moment(values.endDate).unix()) {
      errors.endDate = 'Your end date must be after your start date';
    }
  }
  return errors;
}

const mapDispatchToProps = () => ({
  onSubmitCreateTopicForm: (values) => {
    console.log(values);
    // dispatch(loginWithPassword(values.email, values.password, values.destination));
  },
});

const reduxFormConfig = {
  form: 'createTopic',
  fields: ['name', 'description', 'seedQuery', 'startDate', 'endDate', 'validationPattern',
    'iterations', 'skipSolrQuery', 'isPublic'],
  validate,
};

const CreateTopicContainerForm = reduxForm(reduxFormConfig, null, mapDispatchToProps)(CreateTopicContainer);

export default
  injectIntl(
    CreateTopicContainerForm
  );
