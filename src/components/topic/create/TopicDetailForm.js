import React from 'react';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { Field, reduxForm, propTypes, validate } from 'redux-form';
import { Row, Col } from 'react-flexbox-grid/lib';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import MenuItem from 'material-ui/MenuItem';
import composeIntlForm from '../../common/IntlForm';
import { TOPIC_FORM_MODE_EDIT } from './TopicForm';
import { WarningNotice } from '../../common/Notice';
import Permissioned from '../../common/Permissioned';
import { PERMISSION_MEDIA_EDIT } from '../../../lib/auth';

const localMessages = {
  basics: { id: 'topic.form.section.basics', defaultMessage: 'Basics' },
  name: { id: 'topic.form.detail.name', defaultMessage: 'Topic Name (what is this about?)' },
  nameError: { id: 'topic.form.detail.name.error', defaultMessage: 'Your topic needs a short dsecriptive name.' },
  advancedSettings: { id: 'topic.form.detail.advancedSettings', defaultMessage: 'Advanced Settings' },
  description: { id: 'topic.form.detail.description', defaultMessage: 'Description (why are you making this?)' },
  descriptionError: { id: 'topic.form.detail.desciption.error', defaultMessage: 'Your topic need a description.' },
  seedQuery: { id: 'topic.form.detail.seedQuery', defaultMessage: 'Seed Query' },
  seedQueryError: { id: 'topic.form.detail.seedQuery.error', defaultMessage: 'You must give us a seed query to start this topic from.' },
  seedQueryDescription: { id: 'topic.form.detail.seedQuery.about', defaultMessage: 'Enter a boolean query to select stories that will seed the Topic.  Links in stories already in our database that match this query will be followed to find more stories that might not be in our database already.' },
  queryEditWarning: { id: 'topic.form.detal.query.edit.warning', defaultMessage: '<b>Be careful!</b> If you plan to edit the query and make a new snapshot make sure you only increase the scope of the query.  If you reduce the scope there will be stories from previous snapshots included that don\'t match your new reduced query.' },
  startDate: { id: 'topic.form.detail.startDate', defaultMessage: 'Start Date' },
  endDate: { id: 'topic.form.detail.endDate', defaultMessage: 'End Date' },
  public: { id: 'topic.form.detail.public', defaultMessage: 'Public?' },
  crimsonHexagon: { id: 'topic.form.detail.crimsonHexagon', defaultMessage: 'Crimson Hexagon Id' },
  crimsonHexagonHelp: { id: 'topic.form.detail.crimsonHexagon.help', defaultMessage: 'If you have set up a Crimson Hexagon monitor on our associated account, enter it\'s numeric ID here and we will automatically pull in all the stories linked to by tweets in your monitor.' },
  maxIterations: { id: 'topic.form.detail.maxIterations', defaultMessage: 'Max Spider Iterations' },
  maxIterationsHelp: { id: 'topic.form.detail.maxIterations.help', defaultMessage: 'You can change how many rounds of spidering you want to do.  If you expect this topic to explode with lots and lots of linked-to stories about the same topic, then keep this small.  Otherwise leave it with the default of 15.' },
  twitterIdHelp: { id: 'topic.form.detail.twitterTopicsId', defaultMessage: 'If you have created a separate Twitter-sources topic then enter it\'s topics_id here to tie the two together in our system.' },
  twitterTopicsId: { id: 'topic.form.detail.twitterTopicsId.help', defaultMessage: 'Twitter Id' },
  createTopic: { id: 'topic.form.detail.create', defaultMessage: 'Create' },
  dateError: { id: 'topic.form.detail.date.error', defaultMessage: 'Please provide a date in YYYY-MM-DD format.' },
};

const TopicDetailForm = (props) => {
  const { renderTextField, renderCheckbox, renderSelectField, mode } = props;
  const { formatMessage } = props.intl;
  const iterations = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  let queryWarning = null;
  if (mode === TOPIC_FORM_MODE_EDIT) {
    queryWarning = (
      <WarningNotice>
        <FormattedHTMLMessage {...localMessages.queryEditWarning} />
      </WarningNotice>
    );
  }
  return (
    <div>
      <Row>
        <Col lg={10}>
          <h2><FormattedMessage {...localMessages.basics} /></h2>
        </Col>
      </Row>
      <Row>
        <Col lg={5}>
          <Field
            name="name"
            component={renderTextField}
            floatingLabelText={localMessages.name}
            fullWidth
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
            type="inline"
            fullWidth
            floatingLabelText={formatMessage(localMessages.startDate)}
            label={formatMessage(localMessages.startDate)}
            hintText={formatMessage(localMessages.startDate)}
          />
        </Col>
        <Col lg={5}>
          <Field
            name="end_date"
            component={renderTextField}
            type="inline"
            fullWidth
            floatingLabelText={formatMessage(localMessages.endDate)}
            label={formatMessage(localMessages.endDate)}
            hintText={formatMessage(localMessages.endDate)}
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
          <small><FormattedMessage {...localMessages.seedQueryDescription} /></small>
          {queryWarning}
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
              <Permissioned onlyRole={PERMISSION_MEDIA_EDIT}>
                <Row>
                  <Col lg={12}>
                    <Field
                      name="ch_monitor_id"
                      component={renderTextField}
                      fullWidth
                      floatingLabelText={formatMessage(localMessages.crimsonHexagon)}
                    />
                    <small><FormattedMessage {...localMessages.crimsonHexagonHelp} /></small>
                  </Col>
                </Row>
                <Row>
                  <Col lg={12}>
                    <Field
                      name="twitter_topics_id"
                      component={renderTextField}
                      fullWidth
                      floatingLabelText={formatMessage(localMessages.twitterTopicsId)}
                    />
                    <small><FormattedMessage {...localMessages.twitterIdHelp} /></small>
                  </Col>
                </Row>
              </Permissioned>
              <Row>
                <Col lg={12}>
                  <Field
                    name="max_iterations"
                    component={renderSelectField}
                    fullWidth
                    floatingLabelText={localMessages.maxIterations}
                  >
                    {iterations.map(t => <MenuItem key={t} value={t} primaryText={t} />)}
                  </Field>
                  <small><FormattedMessage {...localMessages.maxIterationsHelp} /></small>
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
  // from form helper
  handleSubmit: React.PropTypes.func.isRequired,
  // from parent
  mode: React.PropTypes.string.isRequired,
  initialValues: React.PropTypes.object,
};

export default
  composeIntlForm(
    reduxForm({ propTypes, validate })(
      TopicDetailForm
    )
  );
