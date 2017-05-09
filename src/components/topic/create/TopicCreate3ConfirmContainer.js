import React from 'react';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { push } from 'react-router-redux';
import composeIntlForm from '../../common/IntlForm';
import DataCard from '../../common/DataCard';
import SourceOrCollectionChip from '../../common/SourceOrCollectionChip';
// import TopicInfo from '../summary/TopicInfo';
import messages from '../../../resources/messages';
import { createTopic, goToCreateTopicStep } from '../../../actions/topicActions';
import { updateFeedback } from '../../../actions/appActions';
import AppButton from '../../common/AppButton';
import { PERMISSION_TOPIC_ADMIN } from '../../../lib/auth';

const localMessages = {
  title: { id: 'topic.create.confirm.title', defaultMessage: 'Step 3: Confirm Your New "{name}" Topic' },
  name: { id: 'topic.create.confirm.name', defaultMessage: '<b>Name</b>: {name}' },
  description: { id: 'topic.create.confirm.description', defaultMessage: '<b>Description</b>: {description}' },
  state: { id: 'topic.create.state', defaultMessage: 'Not yet saved.' }, // or newly saved?
  storyCount: { id: 'topic.create.story.count', defaultMessage: 'You have selected {count} stories.' },
  topicSaved: { id: 'topic.create.saved', defaultMessage: 'We saved your new Topic.' },
  topicNotSaved: { id: 'topic.create.notSaved', defaultMessage: 'That didn\'t work!' },
  feedback: { id: 'topic.create.feedback', defaultMessage: 'Successfully created your new topic!' },
  createTopic: { id: 'topic.create', defaultMessage: 'Create Topic' },
};

const TopicCreate3ConfirmContainer = (props) => {
  const { formValues, finishStep, handlePreviousStep, storyCount } = props;
  const { formatMessage } = props.intl;

  let sourcesAndCollections = [];
  sourcesAndCollections = formValues.sourcesAndCollections.filter(s => s.media_id).map(s => s.media_id);
  sourcesAndCollections.concat(formValues.sourcesAndCollections.filter(s => s.tags_id).map(s => s.tags_id));
  return (
    <DataCard className="topic-info">
      <h2>
        <FormattedMessage {...localMessages.title} values={{ name: formValues.name }} />
      </h2>
      <p>{formValues.description}</p>
      <p>
        <b><FormattedMessage {...localMessages.state} /></b>
      </p>
      <p>
        <b><FormattedMessage {...messages.topicPublicProp} /></b>: { formValues.is_public ? formatMessage(messages.yes) : formatMessage(messages.no) }
        <br />
        <b><FormattedMessage {...messages.topicStartDateProp} /></b>: {formValues.start_date}
        <br />
        <b><FormattedMessage {...messages.topicEndDateProp} /></b>: {formValues.end_date}
        <br />
        <b><FormattedMessage {...localMessages.storyCount} values={{ count: storyCount }} /></b>
      </p>
      <p>
        <b><FormattedHTMLMessage {...messages.topicQueryProp} /></b>
        <code>{formValues.solr_seed_query}</code>
      </p>
      <p>
        <b><FormattedHTMLMessage {...messages.topicSourceCollectionsProp} /></b>
      </p>
      {formValues.sourcesAndCollections.map(object => <SourceOrCollectionChip key={object.tags_id || object.media_id} object={object} />)}
      <AppButton flat label={formatMessage(messages.previous)} onClick={() => handlePreviousStep()} />
      &nbsp; &nbsp;
      <br />
      <AppButton type="submit" label={formatMessage(localMessages.createTopic)} primary onClick={() => finishStep()} />
    </DataCard>
    // TODO make sure ok to take out pattern. Otherwise could reuse TopicInfo
  );
};

TopicCreate3ConfirmContainer.propTypes = {
  // from parent

  initialValues: React.PropTypes.object,
  // form context
  intl: React.PropTypes.object.isRequired,
  handleCreateTopic: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool,
  // from state
  formValues: React.PropTypes.object.isRequired,
  // from dispatch
  finishStep: React.PropTypes.func.isRequired,
  handlePreviousStep: React.PropTypes.func.isRequired,
  storyCount: React.PropTypes.number,
};

const mapStateToProps = state => ({
  formValues: state.form.topicForm.values,
  canSave: state.topics.create.preview.matchingStoryCounts.canSave,
  storyCount: state.topics.create.preview.matchingStoryCounts.count,
  userPermission: state.user.profile.auth_roles,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handlePreviousStep: () => {
    dispatch(goToCreateTopicStep(1));
  },
  handleCreateTopic: (canSave, permission, values) => {
    if (canSave || (permission.includes(PERMISSION_TOPIC_ADMIN))) { // if proper range of seed stories
      const queryInfo = {
        name: values.name,
        description: values.description,
        start_date: values.start_date,
        end_date: values.end_date,
        solr_seed_query: values.solr_seed_query,
        max_iterations: values.max_iterations,
        ch_monitor_id: values.ch_monitor_id === undefined ? '' : values.ch_monitor_id,
        is_public: values.is_public === undefined ? false : values.is_public,
        twitter_topics_id: values.twitter_topics_id,
      };
      queryInfo.is_public = queryInfo.is_public ? 1 : 0;
      if ('sourcesAndCollections' in values) {
        queryInfo['sources[]'] = values.sourcesAndCollections.filter(s => s.media_id).map(s => s.media_id);
        queryInfo['collections[]'] = values.sourcesAndCollections.filter(s => s.tags_id).map(s => s.tags_id);
      } else {
        queryInfo['sources[]'] = '';
        queryInfo['collections[]'] = '';
      }
      dispatch(createTopic(queryInfo)).then((results) => {
        if (results.topics_id) {
          // let them know it worked
          dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(localMessages.feedback) }));
          dispatch(push(`/topics/${results.topics_id}/summary`));
        } else {
          dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(localMessages.failed) }));
        }
      });
    }
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    finishStep: () => {
      dispatchProps.handleCreateTopic(stateProps.canSave, stateProps.userPermission, stateProps.formValues);
    },
  });
}

const reduxFormConfig = {
  form: 'topicForm',
  destroyOnUnmount: false,  // so the wizard works
};

export default
  injectIntl(
    composeIntlForm(
      reduxForm(reduxFormConfig)(
        connect(mapStateToProps, mapDispatchToProps, mergeProps)(
          TopicCreate3ConfirmContainer
        )
      )
    )
  );
